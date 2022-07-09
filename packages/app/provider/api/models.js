
import { ObjectId } from "bson";
import { getCurrentDate } from "../../utils/date";
import * as FileSystem from 'expo-file-system';

export const MODELS_VERSION = 5;
const CURRENCIES = ['€', '$'];

const isUpdateAllowed = (rules, updator) => {
  return Object.entries(updator).every(([property, updatedValue]) => {
    return (
      property in rules && // if user can update this property
      rules[property](updatedValue)  // and did provide a valid new value
    )
  });
}

const updateDocument = (updateRules, realm, document, updator, openTransaction = true) => {
  const writeOK = isUpdateAllowed(updateRules, updator);
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

  static updateRules = {
    'spendingCategories[]': (newValue) => newValue.length !== 0,
    '-spendingCategories[]': (newValue) => newValue.length !== 0,
    'defaultCurrency': (newValue) => CURRENCIES.includes(newValue)
  }

  static update = (realm, diary, updator) => updateDocument(
    this.updateRules,
    realm,
    diary,
    updator
  );

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
    bills = []
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
    this.bills = bills;
  }

  static CURRENCIES = CURRENCIES;

  static updateRules = {
    'name': (newValue) => newValue.length !== 0,
    'amount': (newValue) => newValue > 0,
    'category': (newValue) => newValue.length !== 0,
    'currency': (newValue) => this.CURRENCIES.includes(newValue),
    'when': () => true,
    'where': (newValue) => newValue.length !== 0,
    'bills[]': (args) => args.length !== 0,
    '-bills[]': (args) => args.length !== 0
  }

  static update = (realm, spending, updatorArg, openTransaction = true) => {
    const { bills, ...updator } = updatorArg;
    if (bills) {
      const newBills = bills.filter(bill => !(spending.bills.includes(bill)));
      const billsToRemove = spending.bills.filter(bill => !(bills.includes(bill)));
      if (newBills) {
        updator['bills[]'] = newBills;
      } else {
        updator['-bills[]'] = billsToRemove;
      }
    }
    updateDocument(this.updateRules, realm, spending, updator, openTransaction);
  }
  
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
    primaryKey: '_id',
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
    console.log(typeof spendingID)
    this.spendingIDs = [spendingID];
  }

  static updateRules = {
    'spendingIDs[]': (arg) => arg.length > 0,
    '-spendingIDs[]': (arg) => arg.length > 0
  }
  
  static update = (realm, bill, updator, openTransaction = true) => {
    updateDocument(this.updateRules, realm, bill, updator, openTransaction);
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
      spendingIDs: 'objectId[]'
    },
    primaryKey: 'uri',
  };
}

export const models = { Diary, Spending, Bill };
