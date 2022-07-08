
import { ObjectId } from "bson";
import { getCurrentDate } from "../../utils/date";
import * as FileSystem from 'expo-file-system';

export const MODELS_VERSION = 3;
const CURRENCIES = ['€', '$'];

const updateDocument = (realm, document, updator, openTransaction = true) => {
  const writeOK = this.isUpdateAllowed(updator);
  if (!writeOK) {
    console.log('Operation cancelled: you attempted an invalid update on a Spending object');
    return;
  }

  const update = () => {
    Object.entries(updator).forEach(([property, updatedValue]) => {
      if (property.slice(-2) === '[]') {
        const sliceStart = property[0] === '-' ? 1 : 0;
        const sliced = property.slice(sliceStart, -2);
        if (sliceStart) {
          document[sliced] = document[sliced].filter(el => !(updatedValue.includes(el)));
        } else {
          document[sliced].push(...updatedValue);
        }
      } else {
        document[property] = updatedValue;
      }
    });
  
    document.updatedAt = getCurrentDate();
  }
  
  if (openTransaction) {
    realm.write(update);
  } else {
    update();
  }
}

const isUpdateAllowedForRules = (rules) => (updator) => {
  return Object.entries(updator).every(([property, updatedValue]) => {
    return (
      property in rules && // if user can update this property
      rules[property](updatedValue)  // and did provide a valid new value
    )
  });
}

class Diary {
  /**
   *
   * @param {string} owner The id of the user owning this diary, or 'local' if the user is local only
   * @param {ObjectId} id The ObjectId to create this diary with
   */
  constructor({
    owner = 'local',
    id = new ObjectId(),
  }) {
    this._owner = owner;
    this._id = id;
    this.createdAt = getCurrentDate();
    this.updatedAt = getCurrentDate();
    this.spendingCategories = [];
    this.defaultCurrency = '€';
  }

  static CURRENCIES = CURRENCIES;

  static isUpdateAllowed = isUpdateAllowedForRules({
    'spendingCategories[]': (newValue) => newValue.length !== 0,
    '-spendingCategories[]': (newValue) => newValue.length !== 0,
    'defaultCurrency': (newValue) => CURRENCIES.includes(newValue)
  });

  static update = (realm, diary, updator) => updateDocument(realm, diary, updator);

  static addSpendingCategory = (realm, diary, category) => this.update(
    realm,
    diary,
    { 'spendingCategories[]' : [category] }
  )

  static schema = {
    name: 'Diary',
    properties: {
      _id: 'objectId?',
      createdAt: 'date?',
      updatedAt: 'date?',
      _owner: 'string?',
      spendingCategories: 'string[]',
      defaultCurrency: 'string?'
    },
    primaryKey: '_id',
  };
}

class Spending {
  /**
   *
   * @param {string} owner The id of the user owning this spending, or 'local' if the user is local only
   * @param {ObjectId} id The ObjectId to create this spending with
   * @param {string} name The name of the spending
   * @param {double} amount The amount of the spending
   * @param {string} category The spending category
   * @param {string} currency The spending currency
   * @param {string} where The place where the spending has been made
   * @param {date} when The date when the spending has been made
   */
  constructor({
    owner = 'local',
    id = new ObjectId(),
    name,
    amount,
    category,
    currency,
    where = '',
    when,
  }) {
    this._owner = owner;
    this._id = id;
    this.createdAt = getCurrentDate();
    this.updatedAt = getCurrentDate();
    this.name = name;
    this.amount = amount;
    this.category = category;
    this.currency = currency;
    this.when = when;
    this.where = where;
    this.bills = [];
  }

  static CURRENCIES = CURRENCIES;

  static isUpdateAllowed = isUpdateAllowedForRules({
    'name': (newValue) => newValue.length !== 0,
    'amount': (newValue) => newValue > 0,
    'category': (newValue) => newValue.length !== 0,
    'currency': (newValue) => this.CURRENCIES.includes(newValue),
    'when': () => true,
    'where': (newValue) => newValue.length !== 0,
    'bills[]': (args) => args.length !== 0,
    '-bills[]': (args) => args.length !== 0
  });

  static update = (realm, spending, updator) => updateDocument(realm, spending, updator);
  
  static schema = {
    name: 'Spending',
    properties: {
      _id: 'objectId?',
      createdAt: 'date?',
      updatedAt: 'date?',
      _owner: 'string?',
      name: 'string?',
      amount: 'double?',
      category: 'string?',
      currency: 'string?',
      when: 'date?',
      where: 'string?',
      bills: 'string[]'
    },
  };
}

class Bill {
  /**
   *
   * @param {string} owner The id of the user owning this bill, or 'local' if the user is local only
   * @param {ObjectId} id The ObjectId to create this bill with
   * @param {string} uri The uri of this bill
   * @param {string} spendingID The ID of the spending for which this bill was added
   */
  constructor({
    owner = 'local',
    id = new ObjectId(),
    uri,
    spendingID
  }) {
    this._owner = owner;
    this._id = id;
    this.createdAt = getCurrentDate();
    this.updatedAt = getCurrentDate();
    this.uri = uri;
    this.spendingIDs = [spendingID];
  }

  static isUpdateAllowed = isUpdateAllowedForRules({
    'spendingIDs[]': (arg) => arg.length > 0,
    '-spendingIDs[]': (arg) => arg.length > 0
  });
  
  static update = (realm, bill, updator, openTransaction = true) => {
    updateDocument(realm, bill, updator, openTransaction);
    if (bill.spendingIDs.length === 0) {
      this.deleteBill(realm, bill, openTransaction);
    }
  }

  static deleteBill = (realm, bill, openTransaction = true) => {
    const del = () => {
      realm.delete(bill);
      FileSystem.deleteAsync(bill.uri).then(() => {
        console.log(`Deleted local file ${bill.uri} with success`);
      });
    }

    if (openTransaction) {
      realm.write(del);
    } else {
      del();
    }
  }

  static schema = {
    name: 'Bill',
    properties: {
      _id: 'objectId?',
      createdAt: 'date?',
      updatedAt: 'date?',
      _owner: 'string?',
      uri: 'string',
      spendingIDs: 'string[]'
    },
  };
}

export const models = { Diary, Spending, Bill };
