import React, { useContext, useState, useEffect, useRef } from 'react';
import Realm from 'realm';

import { useAuth } from '../authentication';

import { isUpdateAllowed, models, MODELS_VERSION } from './models';
import { getCurrentDate } from '../../utils/date';

const RealmContext = React.createContext(null);

const RealmProvider = ({ children }) => {
  const { user } = useAuth();

  const [localRealm, setLocalRealm] = useState();
  const [syncRealm, setSyncRealm] = useState();
  const lastUserIDRef = useRef(user?.id);

  const closeLocalRealm = () => {
    if (localRealm) {
      localRealm.close();
      setLocalRealm(undefined);
      console.log('Local realm closed');
    }
  }

  const closeSyncRealm = () => {
    if (syncRealm) {
      syncRealm.close();
      setSyncRealm(undefined);
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
    const getSyncConfig = (userID) => ({
      path: `sync.${userID}.realm`,
      schemaVersion: MODELS_VERSION,
      schema: Object.values(models).map(m => m.schema),
      sync: {
        user,
        partitionValue: userID,
        newRealmFileBehavior: {
          type: 'downloadBeforeOpen'
        },
        existingRealmFileBehavior: {
          type: 'openImmediately'
        }
      }
    })

    let onRealmOpened;
    if (!user) {
      console.log('No user')
      config = localConfig;
      if (lastUserIDRef.current && Realm.exists(getSyncConfig(lastUserIDRef.current))) {
        // delete the sync realm file if no user is logged in, it will be recreated/redownloaded on log in
        Realm.deleteFile(getSyncConfig(lastUserIDRef.current));
        lastUserIDRef.current = undefined;
      }

      onRealmOpened = (openedRealm) => {
        setLocalRealm(openedRealm);
      }

    } else {
      // if their is a user logged in, open a synced realm
      lastUserIDRef.current = user.id;
      config = getSyncConfig(user.id);

      onRealmOpened = (openedRealm) => {
        console.log('Finished download of the sync realm');
        // if after download from App Services, the sync realm is empty, open the local realm
        // and copy all the objects from it, with the necessary changes to their properties
        if (openedRealm.objects('Diary').length === 0) {
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

        }

        setSyncRealm(openedRealm);
      }
    }

    // open a realm to manage the diary of the user
    Realm.open(config).then((openedRealm) => {
      console.log('RealmProvider initialized');
      onRealmOpened(openedRealm);
    }).catch(e => {
      console.log('Error while loading the realm:');
      console.log(e);
    });
  }, [user]);

  useEffect(() => {
    if (!localRealm || localRealm.objects('Diary').length > 0) {
      return;
    }

    const realm = localRealm;
    // If no Diary object has been created yet in the local realm, do it here
    realm.write(() => {
      realm.create(
        'Diary',
        new models.Diary({})
      );
    });
  }, [localRealm]);

  useEffect(() => {
    if (user && syncRealm) {
      closeLocalRealm();
    }

    if (!user && localRealm) {
      closeSyncRealm();
    }
  }, [user, localRealm, syncRealm]);

  // Wait for the realm to open before mounting the children and wrapping them in the RealmContext
  // by returning empty JSX if it is not
  if ((!user && !localRealm) || (user && !syncRealm)) {
    console.log('Realm not yet opened');
    return (
      <>
      </>
    )
  }
  
  let realm;
  if (user) {
    realm = syncRealm;
    // closeLocalRealm();
  } else {
    realm = localRealm;
    // closeSyncRealm();
  }

  const queryAsync = async (objectType, { search, sort, descending, filter } = {}) => {
    if (!realm) return await [];

    const results = realm.objects(objectType);
    if (search) {
      return await results;
    }

    const sortProp = sort === 'date' ? 'when' : sort;
    const sorted = sortProp ? results.sorted(sortProp, descending || false) : results;
    const filtered = filter ? sorted : sorted;
    return await filtered;
  }

  const useQuery = ({
    objectType,
    queryOptions = {},
    onSuccess,
    onError
  }) => {
    const data = useRef();
    // const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [stale, setStale] = useState(false);
    const { search, sort, descending, filter, refresh = true } = queryOptions;

    const retry = () => {
      setLoading(true);
      setError(false);
      setStale(false);
    }

    useEffect(() => {
      if (loading || (stale && refresh) ) {
        stale && setStale(false);
        !loading && setLoading(true);
        queryAsync(objectType, { search, sort, descending, filter })
        .then((res) => {
          data.current = res;
          onSuccess(res);
          setLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
          onError();
        });
      }

    }, [loading, stale]);

    return {
      loading,
      error,
      stale,
      retry
    };
  }

  const useMutations = ({
    mutations,
    onSuccess : onSuccessDefault,
    onError : onErrorDefault
  }) => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const mutate = ({
      variables,
      onSuccess : onSuccessArg,
      onError : onErrorArg
    } = {}) => {
      setSuccess(false);
      setError(false);
      const queue = [];
      mutations.forEach(({
        object,
        operation,
      }) => {
        const { type : objType, id : objId } = object;
        const { type : opType, args = [] } = operation;
        const opArgs = args.reduce((prev, curr) => {
          if (!(curr in variables)) {
            return prev;
          }
          
          return { ...prev, [curr] : variables[curr] };
        }, {});
        let op;
        switch (opType) {
          case 'create':
            op = () => create(objType, opArgs);
            break;
          case 'update':
            op = () => update(objType, objId, opArgs);
            break;
          case 'remove':
            op = () => remove(objType, objId);
            break;
          default:
            throw `Invalid operation ${opType}`;
        }

        queue.push(op);
      });

      realm.write(() => {
        try {
          queue.forEach(op => op());
          setSuccess(true);
          if (onSuccessArg) {
            onSuccessArg();
          } else if (onSuccessDefault) {
            onSuccessDefault();
          }
        } catch (e) {
          setError(true);
          if (onErrorArg) {
            onErrorArg();
          } else if (onErrorDefault) {
            onErrorDefault();
          }
          throw e;
        }
      });
    }

    return {
      success,
      error,
      mutate
    }
  }

  const create = (objType, newData) => {
    console.log('Creating object of type ', objType)
    realm.create(
      objType,
      new models[objType](newData)
    );
  }

  const update = (objType, objId, modifiedData) => {
    const writeOK = isUpdateAllowed(objType, modifiedData);
    console.log('modified : ', modifiedData)
    if (!writeOK) {
      throw `Operation cancelled: you attempted an invalid update on a ${objType} object`
    }

    const obj = realm.objectForPrimaryKey(objType, objId);
    console.log('Updating object of type ', objType);
    Object.entries(modifiedData).forEach((([property, newValue]) => {
      obj[property] = newValue;
    }));

    obj.updatedAt = getCurrentDate();
  }

  const remove = (objType, objId) => {
    console.log('Removing object of type ', objType);
    const obj = realm.objectForPrimaryKey(objType, objId);
    realm.delete(obj);
  }

  return (
    <RealmContext.Provider
      value={{
        useQuery,
        useMutations
      }}
    >
      {children}
    </RealmContext.Provider>
  )
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