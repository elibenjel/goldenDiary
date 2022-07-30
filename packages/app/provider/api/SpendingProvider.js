import React, { useContext, useState, useEffect, useRef } from 'react';
import { ObjectId } from 'bson';

import { ModalConfirmation } from '../../components/pure';

import { useAuth } from '../authentication';
import { useRealm } from '../realm';
import { useDiary, useDiaryActions } from './DiaryProvider';

import { deepCopy } from '../../utils/data';
import { getCurrentDate, getMonthString, getYear } from '../../utils/date';
import { isNonNegativeValue } from '../../utils/validators';

const SpendingContext = React.createContext(null);

export const POSSIBLE_FILTER_VALUES = ['category', 'period'];
export const POSSIBLE_SORT_VALUES = ['name', 'date', 'amount'];
export const POSSIBLE_GROUP_VALUES = ['category', 'month'];

const grouped = (applyTo, group) => {
  if (!applyTo.filtered) {
    return { __ : applyTo };
  }

  const correspondance = {
    category: (obj) => obj.category,
    month: (obj) => `${getMonthString(obj.when)} ${getYear(obj.when)}`
  }

  const whichGroup = correspondance[group];
  const result = {};

  applyTo.forEach(obj => {
    const objGroup = whichGroup(obj);
    if (!(objGroup in result)) {
      result[objGroup] = [];
    }

    result[objGroup].push(obj);
  })

  return result;
}

const defaultUserInputs = {
  name: {
    value: '',
    valid: false,
    setters: {},
    cast: v => v
  },
  category: {
    value: '',
    valid: false,
    setters: {},
    cast: v => v
  },
  newCategory: {
    value: '',
    valid: false,
    setters: {},
    cast: v => v
  },
  amount: {
    value: '',
    valid: false,
    setters: {},
    cast: v => Number(v)
  },
  date: {
    value: getCurrentDate(),
    valid: true,
    setters: {},
    cast: v => v
  },
  bills: {
    value: [],
    valid: true,
    setters: {},
    cast: v => v
  }
}


const SpendingProvider = ({ children }) => {
  // retrieve from the RealmProvider the realm to read and write spending data 
  const { beginTransaction, endTransaction, query, queryForPrimaryKey, create, update, remove } = useRealm();
  const diary = useDiary();
  const { addSpendingCategory } = useDiaryActions();
  const { user } = useAuth();

  // This component needs to run an initialization effect before mounting the children
  const [initialized, setInitialized] = useState(false);

  // Which spending is currently focused: undefined if none, null if the user wants to create
  // a new one, and the spending the user has clicked on otherwise
  const [focusedSpending, setFocusedSpending] = useState();
  const [showInputErrors, setShowInputErrors] = useState(false);

  const [formattingOptions, setFormattingOptions] = useState({
    filter: null,
    sort: 'date',
    descending: true,
    group: 'month',
    search: ''
  });
  const [spendingHistory, setSpendingHistory] = useState();
  const [spendingToRemove, setSpendingToRemove] = useState();

  // Maintain the user input fields state in one object
  const [userInputs, setUserInputs] = useState(deepCopy(defaultUserInputs));

  // Define the function to format the spending history depending on the formatting options chosen
  const formatSpendingHistory = (newOptions = {}) => {
    const options = { ...formattingOptions, ...newOptions };
    if (!POSSIBLE_SORT_VALUES.includes(options.sort)) {
      console.log('You attempted to sort the spending by an invalid descriptor: ', options.sort);
      return;
    }

    if (options.filter !== null && !POSSIBLE_FILTER_VALUES.includes(options.filter)) {
      console.log('You attempted to filter the spending by an invalid descriptor: ', options.filter);
      return;
    }

    if (!POSSIBLE_GROUP_VALUES.includes(options.group)) {
      console.log('You attempted to group the spending by an invalid descriptor: ', options.group);
      return;
    }
    
    setFormattingOptions(options);

    const { group, ...queryOptions } = options;
    const queryResults = query('Spending', queryOptions);
    const results = grouped(queryResults, group);
    setSpendingHistory(results);
  }

  // run this initializer effect to format spendingHistory and to set the setters for userInput before mounting the children
  useEffect(() => {
    if (initialized) {
      return;
    }

    console.log('Running initializer effect for SpendingProvider...')
    formatSpendingHistory();

    const onStringChange = (field) => (value) => {
      const valid = value.length > 0;
      setUserInputs((current) => {
        return {
          ...current,
          [field] : { ...current[field], value, valid }
        }
      });
    }
  
    userInputs.name.setters.change = onStringChange('name');
    userInputs.category.setters.change = (value) => {
      const valid = value.length > 0;
      setUserInputs((current) => {
        return {
          ...current,
          newCategory : { ...current.newCategory, value : '', valid : true},
          category : { ...current.category, value, valid }
        }
      });
    }
    userInputs.newCategory.setters.change = (value) => {
      const valid = value.length > 0;
      setUserInputs((current) => {
        return {
          ...current,
          category : { ...current.category, value : '', valid : true},
          newCategory : { ...current.newCategory, value, valid }
        }
      });
    }

    userInputs.amount.setters.change = (value) => {
      const valid = isNonNegativeValue(value);
      setUserInputs((current) => {
        return {
          ...current,
          amount : { ...current.amount, value, valid }
        }
      });
    }

    userInputs.date.setters.change = (value) => {
      setUserInputs((current) => {
        return {
          ...current,
          date : { ...current.date, value, valid }
        }
      });
    }

    userInputs.bills.setters = {
      addOne: (uri) => {
        const newValue = [...userInputs.bills.value, uri];
        setUserInputs((current) => {
          return {
            ...current,
            bills : { ...current.bills, value : newValue }
          }
        });
      },
      removeOne: (uri) => {
        const newValue = userInputs.bills.value.filter(v => v !== uri);
        setUserInputs((current) => {
          return {
            ...current,
            bills : { ...current.bills, value : newValue }
          }
        });
      },
    }

  console.log('SpendingProvider initialized: spendingHistory retrieved and setters for user inputs defined')
  setInitialized(true);
  }, []);

  // Wait for the initializer effect to execute before mounting the children
  if (!initialized) {
    return <></>;
  }


  const resetUserInputs = () => {
    setUserInputs(current => {
      const newValue = { ...current };
      Object.entries(defaultUserInputs).forEach(([input, { value, valid }]) => {
        newValue[input].value = value;
        newValue[input].valid = valid;
      });
      return newValue;
    });
  }

  const setUserInputsFromSpending = (spending) => {
    const inputs = {
      name: { value : spending.name, valid : true },
      category: { value : spending.category, valid : true },
      newCategory: { value : '', valid : true },
      amount: { value : `${spending.amount}`, valid : true },
      date: { value : spending.when, valid : true },
      bills: { value : [...spending.bills], valid : true },
    }

    setUserInputs(current => {
      const newValue = { ...current };
      Object.entries(inputs).forEach(([input, { value, valid }]) => {
        newValue[input].value = value;
        newValue[input].valid = valid;
      });
      return newValue;
    });
  }

  // if focus is called without arguments, we expressly set focusedSpending to null to create a new spending
  const focus = (spending) => {
    setFocusedSpending(spending || null);
    if (spending) {
      setUserInputsFromSpending(spending);
    } else {
      resetUserInputs();
    }
  }

  // when the user cancel or finish their operations on a spending, set focusedSpending to undefined and reset the state of the modal data
  const blur = () => {
    setFocusedSpending(undefined);
    setShowInputErrors(false);
    resetUserInputs();
  }

  const createSpending = ({
    name,
    amount,
    category,
    currency = diary.defaultCurrency,
    when,
    bills
  }) => {
    const id = new ObjectId();
    create('Spending', {
      owner: user?.id,
      id,
      name,
      amount,
      category,
      currency,
      where: '',
      when,
      bills
    }, formatSpendingHistory);
    return id;
  };

  const updateSpending = (spending, newData) => {
    update(spending, 'Spending', newData, formatSpendingHistory);
  }

  const createBill = (
    uri,
    spendingID
  ) => {
    create('Bill', {
      owner: user?.id,
      uri,
      spendingID
    });
  }

  const assignBillToSpending = (
    uri,
    spendingID
  ) => {
    const bill = queryForPrimaryKey('Bill', uri);
    if (bill) {
      update(bill, 'Bill', {
        spendingIDs: [...bill.spendingIDs, spendingID]
      });
    } else {
      createBill(uri, spendingID);
    }
  }

  const removeBillFromSpending = (
    uri,
    spendingID
  ) => {
    const bill = queryForPrimaryKey('Bill', uri);
    if (bill) {
      update(bill, 'Bill', {
        spendingIDs: bill.spendingIDs.filter((id) => id !== spendingID)
      });
    }
  }
  
  const submitUserInputs = () => {
    const valid = Object.values(userInputs).every(({ valid }) => valid);
    if (!valid) {
      setShowInputErrors(true);
      return 1;
    }

    let addNewCategory = false;
    let addedBills = [];
    let removedBills = [];
    const newData = Object.entries(userInputs).reduce((previous, [property, { value, cast }]) => {
      const next = { ...previous };

      let prop = property;
      switch (property) {
        case 'date':
          prop = 'when';
          break;
        case 'newCategory':
          if (value !== '') {
            addNewCategory = true;
            prop = 'category';
          } else {
            return next
          }
          break;
        case 'category':
          if (property in next) {
            return next;
          }
          break;
        case 'bills':
          if (focusedSpending === null) {
            addedBills = [ ...value ];
            break;
          }

          const currentBills = [...focusedSpending.bills];
          currentBills.forEach(uri => {
            if (!value.includes(uri)) {
              removedBills.push(uri);
            }
          });

          value.forEach(uri => {
            if (!currentBills.includes(uri)) {
              addedBills.push(uri);
            }
          });
          prop = property;
          break;
        default:
          break;
      }

      next[prop] = cast(value);
      return next;
    }, {});

    beginTransaction();
    if (addNewCategory) {
      addSpendingCategory(newData.category);
    }

    let spendingID;
    if (focusedSpending === null) {
      spendingID = createSpending(newData);
    } else {
      spendingID = focusedSpending._id;
      console.log(newData);
      updateSpending(focusedSpending, newData);
    }

    addedBills.forEach(uri => {
      console.log('adding bill to focused spending ...')
      assignBillToSpending(uri, spendingID);
    });
    removedBills.forEach(uri => {
      removeBillFromSpending(uri, spendingID);
    });

    endTransaction();

    blur();
    return 0;
  }

  const removeSpending = (spending) => {
    console.log(spending)
    setSpendingToRemove(spending);
  }
  
  const confirmRemoveSpending = () => {
    beginTransaction();
    remove(spendingToRemove, formatSpendingHistory);
    endTransaction();
  }

  // Render the children within the SpendingContext's provider. The value contains
  // everything that should be made available to descendants that use the
  // useSpendingHistory or useSpendingActions hooks.
  return (
    <SpendingContext.Provider
      value={{
        history: {
          value: spendingHistory,
          format: formatSpendingHistory,
          formattingOptions
        },
        actions: {
          focused: focusedSpending,
          userInputs,
          showInputErrors,
          submit: submitUserInputs,
          remove: removeSpending,
          focus,
          blur
        }
      }}
    >
      {children}
      {
        !!spendingToRemove ?
        <ModalConfirmation
          show={true}
          close={() => setSpendingToRemove(null)}
          confirm={confirmRemoveSpending}
          header="Supprimer cette dépense ?"
          body="Cette opération est irréversible."
          confirmLabel="Supprimer"
        />
        : null
      }
    </SpendingContext.Provider>
  );
}


// The useSpendingHistory hook can be used by any descendant of the SpendingProvider. It
// provides the spending history of the user and the options to format it.
const useSpendingHistory = () => {
  const providedValues = useContext(SpendingContext);
  if (providedValues === null) {
    throw new Error("useSpendingHistory() called outside of a SpendingProvider?"); // an alert is not placed because this is an error for the developer not the user
  }
  return providedValues.history;
};

// The useSpendingActions hook can be used by any descendant of the SpendingProvider. It
// provides the spending actions a user can perform such as functions to
// create, update, and delete the spending in the realm.
const useSpendingActions = () => {
  const providedValues = useContext(SpendingContext);
  if (providedValues === null) {
    throw new Error("useSpendingHistory() called outside of a SpendingProvider?"); // an alert is not placed because this is an error for the developer not the user
  }
  return providedValues.actions;
};

export { SpendingProvider, useSpendingHistory, useSpendingActions };
