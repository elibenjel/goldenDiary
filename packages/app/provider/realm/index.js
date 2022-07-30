import React, { useContext, useState, useEffect, useRef } from 'react';
import Realm from 'realm';

import { useAuth } from '../authentication';

import { isUpdateAllowed, models, MODELS_VERSION } from './models';
import { getCurrentDate } from '../../utils/date';

const RealmContext = React.createContext(null);

const RealmProvider = ({ children }) => {
  const { user } = useAuth();

  const [realm, setRealm] = useState();
  const openTransactionRef = useRef(0);
  const queueRef = useRef([]);
  const invalidTransactionRef = useRef(false);

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
          user,
          partitionValue: user?.id,
          newRealmFileBehavior: OpenRealmBehaviorConfiguration,
          existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
        },
      };
    }

    // open a realm to manage the diary of the user
    Realm.open(config).then((openedRealm) => {
      console.log('RealmProvider initialized : the realm is opened');
      setRealm(openedRealm);

      // If no Diary object has been created yet, do it here
      if (openedRealm.objects("Diary").length === 0) {
        openedRealm.write(() => {
          userDiary = openedRealm.create(
            "Diary",
            new models.Diary({
              owner: user?.id
            })
          );
        });
      }
    });

    return () => {
      // cleanup function
      if (realm) {
        realm.close();
        console.log('Realm closed');
        setRealm(null);
      }
    };
  }, [user]);

  // Wait for the realm to open before mounting the children and wrapping them in the RealmContext
  // by returning empty JSX if it is not
  if (!realm) {
    return <></>;
  }

  // Query the realm for an objectType, and format the result according to different options:
  //     - if provided, search applies to the raw list of results, and no other options apply
  //     - otherwise, sort and descending apply first to the raw list of results
  //     - filter applies on the sorted list of results
  // Returns a list of formatted results
  const query = (objectType, { search, sort, descending, filter } = {}) => {
    if (!realm) return [];

    const results = realm.objects(objectType);
    if (search) {
      return results;
    }

    const sortProp = sort === 'date' ? 'when' : sort;
    const sorted = sortProp ? results.sorted(sortProp, descending || false) : results;
    const filtered = filter ? sorted : sorted;
    return filtered;
  }

  const create = (objectType, objectData, onSuccess = () => null) => {
    if (!realm) {
      console.log('The realm is not yet opened');
      return 1;
    }

    if (openTransactionRef.current === 0) {
      console.log('Impossible to modify the realm without calling beginTransaction before');
      return 2;
    }

    console.log('Adding creation operation to the queue: ', objectType);
    const operation = () => {
      realm.create(
        objectType,
        new models[objectType](objectData)
      );

      onSuccess();
    }

    queueRef.current.push(operation);
    return 0;
  }

  const queryForPrimaryKey = (objectType, primaryKey) => {
    return realm.objectForPrimaryKey(objectType, primaryKey);
  }

  const update = (object, objectType, newObjectData, onSuccess = () => null) => {
    if (!realm) {
      console.log('The realm is not yet opened');
      return 1;
    }
    
    if (openTransactionRef.current === 0) {
      console.log('Impossible to modify the realm without calling beginTransaction before');
      return 2;
    }

    const writeOK = isUpdateAllowed(objectType, newObjectData);
    if (!writeOK) {
      console.log('Operation cancelled: you attempted an invalid update on a ', objectType, ' object');
      invalidTransactionRef.current = true
      return 3;
    }

    console.log('Adding update operation to the queue: ', objectType);
    const operation = () => {
      Object.entries(newObjectData).forEach((([property, newValue]) => {
        object[property] = newValue;
      }));

      object.updatedAt = getCurrentDate();
      onSuccess();
    }

    queueRef.current.push(operation);
    return 0;
  }

  const remove = (object, onSuccess = () => null) => {
    if (!realm) {
      console.log('The realm is not yet opened');
      return 1;
    }
    
    console.log('Adding remove operation to the queue: ', object);
    // const objectToRemove = queryForPrimaryKey(objectType, object._id);
    const operation = () => {
      realm.delete(object);
      onSuccess();
    }

    queueRef.current.push(operation);
    return 0;
  }

  const beginTransaction = () => {
    if (!realm) {
      console.log('The realm is not yet opened');
      return 1;
    }
    
    openTransactionRef.current += 1;
    return 0;
  }

  const endTransaction = () => {
    if (!realm) {
      console.log('The realm is not yet opened');
      return 1;
    }
    
    openTransactionRef.current -= 1;
    if (openTransactionRef.current === 0) {
      if (invalidTransactionRef.current) {
        invalidTransactionRef.current = false;
      } else {
        console.log('Writing to the realm: ', queueRef.current);
        realm.write(() => {
          queueRef.current.forEach(operation => {
            try {
              operation();
            } catch (e) {
              queueRef.current = [];
              throw e;
            }
          });
        });
      }

      queueRef.current = [];
    }

    return 0;
  }

  // Render the children within the RealmContext's provider. The value contains
  // everything that should be made available to descendants that use the
  // useRealm hook.
  return (
    <RealmContext.Provider
      value={{
        query,
        queryForPrimaryKey,
        create,
        update,
        remove,
        beginTransaction,
        endTransaction
      }}
    >
      {children}
    </RealmContext.Provider>
  );
}

// The useRealm hook can be used by any descendant of the RealmProvider. It
// provides a function to query the realm, and to open and close a realm transaction
// in which create, update and remove functions can be used.
const useRealm = () => {
  const providedValues = useContext(RealmContext);
  if (!providedValues) {
    throw new Error("useRealm() called outside of a RealmProvider?"); // an alert is not placed because this is an error for the developer not the user
  }
  return providedValues;
};

export { RealmProvider, useRealm };