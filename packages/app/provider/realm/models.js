import { ObjectId } from 'bson';

import { getCurrentDate } from '../../utils/date';

export const MODELS_VERSION = 1;
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

  // Check for the authorization to update any property of the object:
  // allowed if the property is a key of this object, and if the checker associated returns true for the new value;
  // the checker should not test for the type of the value provided, as this is done using the schema definition
  static updateRules = {
    spendingCategories: () => true,
    defaultCurrency: (v) => CURRENCIES.includes(v)
  }

  static schema = {
    name: 'Diary',
    properties: {
      _id: 'objectId',
      createdAt: 'date',
      updatedAt: 'date',
      _owner: 'string',
      spendingCategories: 'string[]',
      defaultCurrency: 'string'
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

  // Check for the authorization to update any property of the object:
  // allowed if the property is a key of this object, and if the checker associated returns true for the new value;
  // the checker should not test for the type of the value provided, as this is done using the schema definition
  static updateRules = {
    'name': (v) => v.length > 0,
    'amount': (v) => v > 0,
    'category': (v) => v.length > 0,
    'currency': (v) => CURRENCIES.includes(v),
    'when': () => true,
    'where': () => true,
    'bills': () => true,
  }
  
  static schema = {
    name: 'Spending',
    properties: {
      _id: 'objectId',
      createdAt: 'date',
      updatedAt: 'date',
      _owner: 'string',
      name: 'string',
      amount: 'double',
      category: 'string',
      currency: 'string',
      when: 'date',
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
    uri,
    spendingID
  }) {
    this._owner = owner;
    this.createdAt = getCurrentDate();
    this.updatedAt = getCurrentDate();
    this.uri = uri;
    this.spendingIDs = [spendingID];
  }

  static updateRules = {
    'spendingIDs': (v) => true,
  }

  static schema = {
    name: 'Bill',
    properties: {
      createdAt: 'date',
      updatedAt: 'date',
      _owner: 'string',
      uri: 'string',
      spendingIDs: 'objectId[]'
    },
    primaryKey: 'uri',
  };
}

export const models = { Diary, Spending, Bill };

export const isUpdateAllowed = (objectType, newObjectData) => {
  const rules = models[objectType].updateRules;
  return Object.entries(newObjectData).every(([property, updatedValue]) => {
    return (
      property in rules && // if user can update this property
      rules[property](updatedValue)  // and did provide a valid new value
    )
  });
}
