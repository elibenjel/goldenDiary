import AsyncStorage from '@react-native-async-storage/async-storage';
import { genID } from '../utils';

const isDate = (d) => {
  return (
    'day' in d &&
    'month' in d &&
    'year' in d
  );
}

const compareDates = (d1, d2) => {
  const compareByKey = (key) => {
    if (d1[key] !== d2[key]) {
      return d1[key] < d2[key] ? [d1, d2] : [d2, d1];
    }
    return null;
  }

  let comparison = null;
  for (key of ['year', 'month', 'day']) {
    comparison = compareByKey(key);
    if (comparison !== null) return comparison;
  }

  return comparison;
}

// const parseData = (data) => JSON.parse(data, (key, value) => {
//   if (typeof value === 'string') {
//     return value.substring(1, value.length - 1);
//   } else return value;
// });
const parseData = (date) => JSON.parse(data);

// const formatKey = (key) => JSON.stringify({ api: 'spendings', ...key });
const formatKey = (key) => JSON.stringify([ 'spendings', ...key ]);

const getItemKey = ({ date, category }) => formatKey([
  'history',
  date.year,
  date.month,
  date.day,
  category
]);

const CATEGORY_KEY = formatKey(['categories']);

const getMetaData = () => {
  const ID = genID();
  const createdAt = new Date().toDateString();
  return { ID, createdAt, lastUpdatedAt: createdAt };
}

export const getAllSpendingsCategories = async () => {
  let categories = [];
  try {
    categories = parseData(await AsyncStorage.getItem(CATEGORY_KEY));
    if (categories === null) {
      categories = [];
    }
  } catch (e) {
    console.error(e)
  }

  return categories;
}

export const addSpendingsCategory = async (category) => {
  const value = JSON.stringify(category);
  const current = await getAllSpendingsCategories();
  try {
    await AsyncStorage.setItem(CATEGORY_KEY, JSON.stringify([...current, value]));
  } catch (e) {
    console.error(e)
  }
}

export const removeSpendingsCategory = async (category) => {
  const current = await getAllSpendingsCategories();
  if (current.length === 0) {
    console.error('No categories currently exist');
    return;
  }

  const indexToRemove = current.findIndex(el => el === category);
  if (indexToRemove === -1) {
    console.error('The category', category, 'does not exist');
    return;
  }
  
  const newValue = current.splice(indexToRemove, 1);
  try {
    await AsyncStorage.setItem(CATEGORY_KEY, JSON.stringify(newValue));
  } catch (e) {
    console.error(e);
  }
}

export const addToHistory = async (item) => {
  const { date, category } = item;
  const { day, month, year } = date;
  const errormsg = `Invalid values provided to add to spendings history (${{ date, category }})`;
  if (
    !isDate(date) ||
    typeof category !== 'string' ||
    category.length === 0
  ) {
    console.error(errormsg);
    return;
  }

  const key = SPENDINGS_KEY;
  const { ...metaData } = getMetaData();
  const value = { ...item, ...metaData };
  
  try {
    let current = await readHistory(key);
    
    if (current === null) {
      current = {};
    }
    if (!(year in current)) {
      current[year] = {};
    }
    if (!(month in current[year])) {
      current[year][month] = {};
    }
    if (!(day in current[year][month])) {
      current[year][month][day] = {};
    }
    if (!(category in current[year][month][day])) {
      current[year][month][day][category] = [];
    }

    current[year][month][day][category].push(value)

    await AsyncStorage.setItem(key, JSON.stringify(current));
  } catch(e) {
    console.error(e);
  }
}

export const readHistory = async ({ from : fromArg, to : toArg, categories : categoriesArg }) => {
  // const errormsg = `Invalid values provided to read spendings history:\n${{ from, to, categories }}`;
  const from = isDate(fromArg) ? fromArg : null;
  const to = isDate(toArg) ? toArg : null;
  const categories = Array.isArray(categoriesArg) && categoriesArg.length > 0 ? categoriesArg : null;

  const key = SPENDINGS_KEY;
  try {
    let history = await AsyncStorage.getItem(key);
    if (history === null) return [];
    
    history = parseData(history);
    const result = [];
    for (const year in history) {
      if (from && year < from.year) continue;
      if (to && year > to.year) break;
      for (const month in history[year]) {
        if (from && month < from.month) continue;
        if (to && month > to.month) break;
        for (const day in history[year][month]) {
          if (from && day < from.day) continue;
          if (to && day > to.day) break;
          for (const category in history[year][month][day]) {
            if (categories && !(category in categories)) continue;
            for (const item of history[year][month][day][category]) {
              result.push(item);
            }
          }
        }
      }
    }
  } catch(e) {
    console.error(e);
  }
}

export const updateHistory = async ({ date, category, ID, erase }) => {
  const value = await readHistory({ date, category });
  if (value === null) {
    console.error(`No data corresponding to the following values:\n${{ date, category}}`);
    return;
  }

  const itemIndex = value.findIndex(el => el.ID === ID);
  if (itemIndex === -1) {
    console.error('No spendings found with the ID:', ID);
    return;
  }

  const item = value[itemIndex];
  const newItem = {
    ...item,
    ...erase,
    lastUpdatedAt: new Date().toDateString()
  }

  const newValue = value.splice(itemIndex, 1, newItem);
  
  const key = getItemKey({ date, category });
  try {
    await AsyncStorage.setItem(key, JSON.stringify(newValue));
  } catch(e) {
    console.error(e);
  }
}
