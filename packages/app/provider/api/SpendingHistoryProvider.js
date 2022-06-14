import React, { useContext, useState, useEffect, useRef } from "react";
import Realm from "realm";
import models from "./models";
import { useAuth } from "../authentication";
import { useDiary } from "./DiaryProvider";

const SpendingHistoryContext = React.createContext(null);

const SpendingHistoryProvider = ({ children }) => {
  const [spendingHistory, setSpendingHistory] = useState([]);
  const [options, setOptions] = useState({
    sortBy: 'when',
    descending: true,
    groupBy: null
  });
  const { user } = useAuth();
  const { diary } = useDiary();

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

      const sortedSpending = spendingRealm.objects("Spending").sorted(options.sortBy, options.descending);

      setSpendingHistory([...sortedSpending]);
      sortedSpending.addListener(() => {
        setSpendingHistory([...sortedSpending]);
      });
    });

    return () => {
      // cleanup function
      const spendingRealm = realmRef.current;
      if (spendingRealm) {
        spendingRealm.close();
        realmRef.current = null;
        setSpendingHistory([]);
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
    const writeOK = Object.entries(updator).every(([property, updatedValue]) => {
      return (
        property in models.Spending.USER_CAN_UPDATE && // if user can update this property
        models.Spending.USER_CAN_UPDATE[property](updatedValue)  // and did provide a valid new value
      )
    })
    
    if (!writeOK) {
      console.log('You attempted an invalid update on a Spending object');
      return;
    }

    spendingRealm.write(() => {
      Object.entries(updator).forEach(([property, updatedValue]) => {
        spending[property] = updatedValue;
      });
    });
  }

  const deleteSpending = (spending) => {
    const spendingRealm = realmRef.current;
    spendingRealm.write(() => {
      spendingRealm.delete(spending);
      const sortedSpending = spendingRealm.objects("Spending").sorted(options.sortBy, options.descending);
      setSpendingHistory([...sortedSpending]);
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
  if (spendingHistory == null) {
    throw new Error("useSpendingHistory() called outside of a SpendingHistoryProvider?"); // an alert is not placed because this is an error for the developer not the user
  }
  return spendingHistory;
};

export { SpendingHistoryProvider, useSpendingHistory };
