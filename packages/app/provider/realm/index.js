import React, { useContext, useState, useEffect, useRef } from 'react';
import Realm from 'realm';

import { useAuth } from '../authentication';

import { isUpdateAllowed, models, MODELS_VERSION } from './models';
import { getCurrentDate } from '../../utils/date';

const RealmContext = React.createContext(null);

const RealmProvider = ({ children }) => {
  const { user } = useAuth();

  const localRealmRef = useRef();
  const syncRealmRef = useRef();
  const realmRef = useRef();
  const [version, setVersionAlt] = useState(0);
  const setVersion = (arg) => {
    console.log(version);
    setVersionAlt(arg);
  }
  const openTransactionRef = useRef(0);
  const queueRef = useRef([]);
  const savedResRef = useRef([]);
  const invalidTransactionRef = useRef(false);

  const closeLocalRealm = () => {
    if (localRealmRef.current) {
      localRealmRef.current.close();
      localRealmRef.current = undefined;
      console.log('Local realm closed');
    }
  }

  const closeSyncRealm = () => {
    if (syncRealmRef.current) {
      syncRealmRef.current.close();
      syncRealmRef.current = undefined;
      console.log('Sync realm closed');
    }
  }

  useEffect(() => {

    // if no user is logged in : usage with a realm in local only mode
    let config;
    const localConfig = {
      path: 'localOnly.realm',
      schemaVersion: MODELS_VERSION,
      schema: Object.values(models).map(m => m.schema),
    };

    // Enables offline-first: open the realm immediately locally without waiting 
    // for the download of the synchronized realm to be completed.
    const syncConfig = {
      path: 'sync.realm',
      schemaVersion: MODELS_VERSION,
      schema: Object.values(models).map(m => m.schema),
      sync: {
        user,
        partitionValue: user?.id,
        newRealmFileBehavior: {
          type: 'downloadBeforeOpen'
        },
        existingRealmFileBehavior: {
          type: 'openImmediately'
        }
      }
    }

    let onRealmOpened;
    if (!user) {
      config = localConfig;
      if (Realm.exists(syncConfig)) {
        // delete the sync realm file if no user is logged in, it will be recreated/redownloaded on log in
        Realm.deleteFile(syncConfig);
      }

      onRealmOpened = (openedRealm) => {
        localRealmRef.current = openedRealm;
        setVersion(v => v + 1);
      }

    } else {
      // if their is a user logged in, open a synced realm
      config = syncConfig;

      // if the sync realm already exists, do nothing and set the state variable
      // if (Realm.exists(config)) {
      //   onRealmOpened = (openedRealm) => {
      //     if (openedRealm.objects('Diary').length === 0) {
      //       console.log('Sync realm corrupted, deleting...');
      //       openedRealm.close();
      //       Realm.deleteFile(syncConfig);
      //     } else {
      //       console.log('Sync realm already exists. Opening...');
      //       setSyncRealm(openedRealm);
      //     }
      //   }
      // } else {
        onRealmOpened = (openedRealm) => {
          console.log('Finished download of the sync realm')
          console.log(openedRealm);
          syncRealmRef.current = openedRealm;
          // if after download from App Services, the sync realm is empty, close it, open the local realm
          // and copy all the objects to the sync config, with the necessary changes to their properties
          if (openedRealm.objects('Diary').length === 0) {
            const copyLocalToSync = (localRealm) => {
              console.log('Copying local realm to sync realm...');
              console.log('Copying Diary object...');
              const replace = { _owner : `${user.id}` };
              openedRealm.write(() => {
                const diary = localRealm.objects('Diary')[0];
                openedRealm.create(
                  'Diary',
                  models.Diary.copy(diary, replace)
                )
              });

              const spending = localRealm.objects('Spending');
              console.log('Copying Spending objects...');
              openedRealm.write(() => {
                spending.forEach(sp => {
                  const spendingCopy = models.Spending.copy(sp, replace);

                  openedRealm.create(
                    'Spending',
                    spendingCopy
                  );
                });
              });

              console.log('Sync realm built');
              setVersion(v => v + 1);
            }
            
            if (localRealmRef.current) {
              copyLocalToSync(localRealmRef.current);
            } else {
              Realm.open(localConfig).then(localRealm => {
                copyLocalToSync(localRealm);
                localRealm.close();
              }).catch((e) => {
                console.log(e);
              });
            }
          } else {
            setVersion(v => v + 1);
          }
        }
      // }
    }

    // open a realm to manage the diary of the user
    Realm.open(config).then((openedRealm) => {
      onRealmOpened(openedRealm);
      console.log('RealmProvider initialized');
    }).catch(e => {
      console.log('Error while loading the realm:');
      console.log(e);
    });
  }, [user]);

  // if the local realm has no Diary object, create one
  useEffect(() => {
    if (!localRealmRef.current || localRealmRef.current.objects('Diary').length > 0) {
      return;
    }

    const realm = localRealmRef.current;

    // If no Diary object has been created yet in the local realm, do it here
    realm.write(() => {
      realm.create(
        'Diary',
        new models.Diary({})
      );
    });
  });

  // Wait for the realm to open before mounting the children and wrapping them in the RealmContext
  // by returning empty JSX if it is not
  if ((!user && !localRealmRef.current) || (user && !syncRealmRef.current)) {
    console.log(user, localRealmRef.current, syncRealmRef.current)
    console.log('Realm not yet opened');
    return <></>;
  }
  
  let realm;
  if (user) {
    realm = syncRealmRef.current;
    closeLocalRealm();
  } else {
    realm = localRealmRef.current;
    closeSyncRealm();
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

  const create = ({ objectType, objectData, onSuccess = () => null, saveResTo }) => {
    if (!realm) {
      console.log('The realm is not yet opened');
      return 1;
    }

    if (openTransactionRef.current === 0) {
      console.log('Impossible to modify the realm without calling beginTransaction before');
      return 2;
    }

    console.log('Adding creation operation to the queue: ', objectType, objectData);
    const operation = () => {
      const obj = realm.create(
        objectType,
        new models[objectType](objectData)
      );

      if (saveResTo) {
        console.log('saved:', obj)
        savedResRef.current[saveResTo] = obj;
      }

      onSuccess();
    }

    queueRef.current.push(operation);
    return 0;
  }

  const queryForPrimaryKey = (objectType, primaryKey) => {
    return realm.objectForPrimaryKey(objectType, primaryKey);
  }

  const update = ({ objectType, object, objectLazy, newObjectData, newObjectDataLazy, onSuccess = () => null }) => {
    if (!realm) {
      console.log('The realm is not yet opened');
      return 1;
    }
    
    if (openTransactionRef.current === 0) {
      console.log('Impossible to modify the realm without calling beginTransaction before');
      return 2;
    }

    
    const writeOK = newObjectData ? isUpdateAllowed(objectType, newObjectData) : true;
    if (!writeOK) {
      console.log('Operation cancelled: you attempted an invalid update on a ', objectType, ' object');
      invalidTransactionRef.current = true
      return 3;
    }
    
    console.log('Adding update operation to the queue: ', objectType);
    const operation = () => {
      const obj = object || objectLazy(savedResRef);
      const newObjData = newObjectData || newObjectDataLazy(savedResRef);
      Object.entries(newObjData).forEach((([property, newValue]) => {
        obj[property] = newValue;
      }));

      obj.updatedAt = getCurrentDate();
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
    console.log(openTransactionRef.current);
    return 0;
  }

  const endTransaction = () => {
    if (!realm) {
      console.log('The realm is not yet opened');
      return 1;
    }
    
    openTransactionRef.current -= 1;
    console.log(openTransactionRef.current);
    if (openTransactionRef.current === 0) {
      if (invalidTransactionRef.current) {
        console.log('Resetting operation queue')
        invalidTransactionRef.current = false;
      } else {
        console.log('Writing to the realm: ', queueRef.current);
        realm.write(() => {
          queueRef.current.forEach(operation => {
            try {
              operation();
            } catch (e) {
              queueRef.current = [];
              savedResRef.current = {};
              throw e;
            }
          });
        });
      }

      queueRef.current = [];
      savedResRef.current = {};
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
        endTransaction,
        // assignBillToSpending,
        // removeBillFromSpending,
        // addSpendingCategory,
        // createSpending,
        // updateSpending,
        // removeSpending
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
    throw new Error('useRealm() called outside of a RealmProvider?'); // an alert is not placed because this is an error for the developer not the user
  }
  return providedValues;
};

export { RealmProvider, useRealm };