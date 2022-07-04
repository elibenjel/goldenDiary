
import { ObjectId } from "bson";
import { getCurrentDate } from "../../utils/date";

export const MODELS_VERSION = 3;
const CURRENCIES = ['€', '$'];

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

  static isUpdateAllowed = (updator) => {
    const rules = {
      'spendingCategories': (newValue) => newValue.length !== 0,
    };

    return Object.entries(updator).every(([property, updatedValue]) => {
      return (
        property in rules && // if user can update this property
        rules[property](updatedValue)  // and did provide a valid new value
      )
    });
  };

  static CURRENCIES = CURRENCIES;

  static addSpendingCategory = (realm, diary, category) => {
    const writeOK = this.isUpdateAllowed({ spendingCategories : category });
    if (!writeOK) {
      console.log(`Operation cancelled: cannot add ${category} to the list of spending categories`);
      return;
    }

    realm.write(() => {
      diary.spendingCategories.push(category);
    });
  }

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
  }

  static CURRENCIES = CURRENCIES;

  static isUpdateAllowed = (updator) => {
    const rules = {
      'name': (newValue) => newValue.length !== 0,
      'amount': (newValue) => newValue > 0,
      'category': (newValue) => newValue.length !== 0,
      'currency': (newValue) => this.CURRENCIES.includes(newValue),
      'when': () => true,
      'where': (newValue) => newValue.length !== 0
    };

    return Object.entries(updator).every(([property, updatedValue]) => {
      return (
        property in rules && // if user can update this property
        rules[property](updatedValue)  // and did provide a valid new value
      )
    });
  };


  static update = (realm, spending, updator) => {
    const writeOK = this.isUpdateAllowed(updator);
    if (!writeOK) {
      console.log('Operation cancelled: you attempted an invalid update on a Spending object');
      return;
    }

    realm.write(() => {
      Object.entries(updator).forEach(([property, updatedValue]) => {
        spending[property] = updatedValue;
      });
    });
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
  };
}

export const models = { Diary, Spending };
