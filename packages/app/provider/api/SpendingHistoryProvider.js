import React, { useContext, useState, useEffect, useRef } from "react";
import Realm from "realm";
import { models } from "./models";
import { useAuth } from "../authentication";
import { useDiary } from "./DiaryProvider";
import { getMonthlyPeriod, getYearlyPeriod } from "../../utils/date";

const SpendingHistoryContext = React.createContext(null);
export const POSSIBLE_FILTER_VALUES = ['month', 'year'];
export const POSSIBLE_SORT_VALUES = ['name', 'date', 'amount'];
export const POSSIBLE_GROUP_VALUES = ['category'];

const SpendingHistoryProvider = ({ children }) => {
  const { diary } = useDiary();
  const { user } = useAuth();
  const [rawSpendingHistory, setRawSpendingHistory] = useState([]);
  const [spendingHistory, setSpendingHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState({
    filter: null,
    sort: 'name',
    descending: true,
    group: null
  });

  const sorted = (descriptor, descending = false, applyTo = rawSpendingHistory) => {

    if (descriptor === null) return;
    if (!POSSIBLE_SORT_VALUES.includes(descriptor)) {
      console.log('You attempted to sort the spending by an invalid descriptor: ', descriptor);
      return;
    }

    const correspondance = {
      name: 'name',
      date: 'when',
      amount: 'amount'
    }

    setOptions(current => ({
      ...current,
      sort: descriptor,
      descending
    }));

    const result = applyTo.sorted && applyTo.sorted(correspondance[descriptor], descending);
    result && setSpendingHistory(result);
    return result;
  }

  const filtered = (descriptor, applyTo = rawSpendingHistory) => {
    
    if (descriptor === null) return;
    if (!POSSIBLE_FILTER_VALUES.includes(descriptor)) {
      console.log('You attempted to filter the spending with an invalid descriptor: ', descriptor);
      return;
    }
    
    const { start : startOfMonth, end : endOfMonth } = getMonthlyPeriod();
    const { start : startOfYear, end : endOfYear } = getYearlyPeriod();
    const predicates = {
      month: ['when >= $0 && when <= $1', startOfMonth, endOfMonth],
      year: ['when >= $0 && when <= $1', startOfYear, endOfYear]
    }


    setOptions(current => ({
      ...current,
      filter: descriptor
    }));

    const result = applyTo.filtered && applyTo.filtered(predicates[descriptor]);
    result && setSpendingHistory(result);
    return result;
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

      const spending = spendingRealm.objects("Spending");

      setRawSpendingHistory(spending);
      spending.addListener(() => {
        setRawSpendingHistory(spending);
      });

      const sortedSpending = sorted(options.sort, options.descending, spending);
      filtered(options.filter, sortedSpending);
    });
    
    return () => {
      // cleanup function
      const spendingRealm = realmRef.current;
      if (spendingRealm) {
        spendingRealm.close();
        console.log('SpendingHistory Realm closed')
        realmRef.current = null;
        setRawSpendingHistory([]);
      }
    };
  }, [user]);

  const createSpending = ({
    name,
    amount,
    category,
    currency = diary.defaultCurrency,
    where,
    when
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
          when
        })
      );
    });
  };

  const updateSpending = (spending, updator) => {
    const spendingRealm = realmRef.current;
    models.Spending.update(spendingRealm, spending, updator)
  }

  const deleteSpending = (spending) => {
    const spendingRealm = realmRef.current;
    spendingRealm.write(() => {
      spendingRealm.delete(spending);
      const newSpending = spendingRealm.objects("Spending");
      setRawSpendingHistory([...newSpending]);
    });
  }

  // Render the children within the SpendingHistoryContext's provider. The value contains
  // everything that should be made available to descendants that use the
  // useSpendingHistory hook.
  return (
    <SpendingHistoryContext.Provider
      value={{
        createSpending,
        updateSpending,
        deleteSpending,
        spendingHistory,
        sorted,
        filtered,
        options,
        search,
        searchFor
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

export { SpendingHistoryProvider, useSpendingHistory };
