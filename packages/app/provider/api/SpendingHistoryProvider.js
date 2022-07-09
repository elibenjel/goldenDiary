import React, { useContext, useState, useEffect, useRef } from 'react';
import Realm from 'realm';
import { models, MODELS_VERSION } from './models';
import { useAuth } from '../authentication';
import { useDiary } from './DiaryProvider';
import { getMonthlyPeriod, getMonthString, getYear, getYearlyPeriod } from '../../utils/date';
import { CameraProvider, useCamera } from '../camera';

const SpendingHistoryContext = React.createContext(null);

export const POSSIBLE_FILTER_VALUES = ['category', 'period'];
export const POSSIBLE_SORT_VALUES = ['name', 'date', 'amount'];
export const POSSIBLE_GROUP_VALUES = ['category', 'month'];

const sorted = (applyTo, descriptor, descending = false) => {
  const correspondance = {
    name: 'name',
    date: 'when',
    amount: 'amount'
  }

  if (!applyTo.sorted) {
    return applyTo;
  }

  return applyTo.sorted(correspondance[descriptor], descending);
}

const filtered = (applyTo, descriptor) => {
  // const { start : startOfMonth, end : endOfMonth } = getMonthlyPeriod();
  // const { start : startOfYear, end : endOfYear } = getYearlyPeriod();
  // const predicates = {
  //   month: ['when >= $0 && when <= $1', startOfMonth, endOfMonth],
  //   year: ['when >= $0 && when <= $1', startOfYear, endOfYear]
  // }

  if (!applyTo.filtered) {
    return applyTo;
  }

  return applyTo;
}

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

const SpendingHistoryProvider = ({ children }) => {
  const { diary } = useDiary();
  const { user } = useAuth();
  const rawSpending = useRef([]);
  const [spendingHistory, setSpendingHistory] = useState({});
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState({
    filter: null,
    sort: 'date',
    descending: true,
    group: 'month'
  });

  const formatSpendingHistory = (newOptions) => {
    if (!POSSIBLE_SORT_VALUES.includes(newOptions.sort)) {
      console.log('You attempted to sort the spending by an invalid descriptor: ', newOptions.sort);
      return;
    }

    if (newOptions.filter !== null && !POSSIBLE_FILTER_VALUES.includes(newOptions.filter)) {
      console.log('You attempted to filter the spending by an invalid descriptor: ', newOptions.filter);
      return;
    }

    if (!POSSIBLE_GROUP_VALUES.includes(newOptions.group)) {
      console.log('You attempted to group the spending by an invalid descriptor: ', newOptions.group);
      return;
    }

    setOptions(newOptions);
    const sortedSpending = sorted(rawSpending.current, newOptions.sort, newOptions.descending);
    const filteredSpending = filtered(sortedSpending, newOptions.filter)
    const result = grouped(filteredSpending, newOptions.group);

    setSpendingHistory(result);
  }

  const searchFor = (value) => {
    setSearch(value);
  }

  // Use a Ref to store the realm rather than the state because it is not
  // directly rendered, so updating it should not trigger a re-render as using
  // state would.
  const realmRef = useRef(null);

  useEffect(() => {
    let config;

    if (!user) {
      // if no user is logged in : usage with a realm in local only mode
      config = {
        path: 'localOnly.realm',
        schemaVersion: MODELS_VERSION,
        schema: Object.values(models).map(m => m.schema),
      };
    } else {
      // if their is a user logged in, open a synced realm
      // Enables offline-first: open the realm immediately locally without waiting 
      // for the download of the synchronized realm to be completed.
      const OpenRealmBehaviorConfiguration = {
        type: 'openImmediately',
      };
      config = {
        path: 'sync.realm',
        schemaVersion: MODELS_VERSION,
        schema: Object.values(models).map(m => m.schema),
        sync: {
          user: user,
          partitionValue: user?.id,
          newRealmFileBehavior: OpenRealmBehaviorConfiguration,
          existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
        },
      };
    }

    // open a realm to manage the spending history of the user
    Realm.open(config).then((spendingRealm) => {
      realmRef.current = spendingRealm;

      rawSpending.current = spendingRealm.objects('Spending');

      // rawSpending.current.addListener(() => {
      //   formatSpendingHistory(options);
      // });

      formatSpendingHistory(options);
    });

    return () => {
      // cleanup function
      const spendingRealm = realmRef.current;
      if (spendingRealm) {
        spendingRealm.close();
        console.log('SpendingHistory Realm closed')
        realmRef.current = null;
        rawSpending.current = [];
        setSpendingHistory({});
      }
    };
  }, [user]);

  const createSpending = ({
    name,
    amount,
    category,
    currency = diary.defaultCurrency,
    where,
    when,
    bills
  }) => {
    const spendingRealm = realmRef.current;
    spendingRealm.write(() => {
      spendingRealm.create(
        "Spending",
        new models.Spending({
          owner: user?.id,
          name,
          amount,
          category,
          currency,
          where,
          when,
          bills
        })
      );
    });
    formatSpendingHistory(options);
  };

  const updateSpending = (focusedSpending, updator, openTransaction = true) => {
    const spendingRealm = realmRef.current;
    models.Spending.update(spendingRealm, focusedSpending, updator, openTransaction)
    formatSpendingHistory(options);
  }

  const retrieveBillByURI = (uri) => {
    const spendingRealm = realmRef.current;
    const bill = spendingRealm.objectForPrimaryKey('Bill', uri);
    return bill;
  }

  const deleteSpending = (spending) => {
    const spendingRealm = realmRef.current;
    spendingRealm.write(() => {
      spending.bills.forEach(uri => {
        const bill = retrieveBillByURI(uri);
        models.Bill.update(spendingRealm, bill, { '-spendingIDs[]' : [spending._id] }, false);
      });
      spendingRealm.delete(spending);
      rawSpending.current = spendingRealm.objects('Spending');
      formatSpendingHistory(options);
    });
  }

  const assignBillToSpending = (uri, focusedSpending) => {
    const spendingRealm = realmRef.current;
    const existingBill = retrieveBillByURI(uri);
    spendingRealm.write(() => {
      if (existingBill) { // there is a Bill with this ID
        updateSpending(focusedSpending, { 'bills[]' : [existingBill.uri] }, false);
        models.Bill.update(spendingRealm, existingBill, { 'spendingIDs[]' : [focusedSpending._id] }, false)
      } else {
        const newBill = new models.Bill({
          owner: user?.id,
          uri,
          spendingID: focusedSpending._id,
        });
    
        spendingRealm.create(
          "Bill",
          newBill
        );
    
        updateSpending(focusedSpending, { 'bills[]' : [newBill.uri]}, false);
      }
    });
  }

  const removeBillFromSpending = (uri, focusedSpending) => {
    const spendingRealm = realmRef.current;
    const bill = retrieveBillByURI(uri);
    if (bill) { // there is a Bill with this ID
      spendingRealm.write(() => {
        updateSpending(focusedSpending, { '-bills[]' : [bill.uri] }, false);
        models.Bill.update(spendingRealm, bill, { '-spendingIDs[]' : [focusedSpending._id] }, false)
      });
    }
  }

  // Render the children within the SpendingHistoryContext's provider. The value contains
  // everything that should be made available to descendants that use the
  // useSpendingHistory hook.
  return (
    <SpendingHistoryContext.Provider
      value={{
        spendingHistory,
        formatSpendingHistory,
        createSpending,
        updateSpending,
        deleteSpending,
        assignBillToSpending,
        removeBillFromSpending,
        options,
        search,
        searchFor,
        // setFocusedSpending,
      }}
    >
      {children}
    </SpendingHistoryContext.Provider>
  );
};

// The useSpendingHistory hook can be used by any descendant of the SpendingHistoryProvider. It
// provides the spending history of the user and various functions to
// create, update, and delete the spending in the history.
const useSpendingHistory = () => {
  const spendingHistory = useContext(SpendingHistoryContext);
  if (spendingHistory === null) {
    throw new Error("useSpendingHistory() called outside of a SpendingHistoryProvider?"); // an alert is not placed because this is an error for the developer not the user
  }
  return spendingHistory;
};

// const SpendingHistoryProvider = ({ saveDir, children }) => (
//   // <CameraProvider saveDir={saveDir}>
//     <SpendingProvider>
//       {children}
//     </SpendingProvider>
//   // </CameraProvider>
// )

export { SpendingHistoryProvider, useSpendingHistory };
