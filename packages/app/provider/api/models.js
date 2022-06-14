
import { ObjectId } from "bson";
import { getCurrentDate } from "../../utils/date";

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

  static USER_CAN_UPDATE = {
    'spendingCategories': (newValue) => newValue.every((str) => str.length !== 0),
  };

  static CURRENCIES = CURRENCIES;

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

  static USER_CAN_UPDATE = {
    'name': (newValue) => newValue.length !== 0,
    'amount': (newValue) => newValue > 0,
    'category': (newValue) => newValue.length !== 0,
    'currency': (newValue) => newValue === '€' || newValue === '$',
    'when': () => true,
    'where': () => true
  };

  static CURRENCIES = CURRENCIES;

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
    },
  };
}

export const models = { Diary, Spending };
