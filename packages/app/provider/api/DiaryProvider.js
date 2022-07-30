import React, { useContext, useState, useEffect, useRef } from 'react';

import { useRealm } from '../realm';

const DiaryContext = React.createContext(null);

const DiaryProvider = ({ children }) => {
  const { beginTransaction, endTransaction, query, update } = useRealm();

  const [diary, setDiary] = useState(query('Diary')[0]);

  const addSpendingCategory = (category) => {
    beginTransaction();
    update(diary, 'Diary', {
      spendingCategories: [...diary.spendingCategories, category]
    }, () => setDiary(query('Diary')[0]));
    endTransaction();
  }

  const resetSettings = () => {

  }

  return (
    <DiaryContext.Provider
      value={{
        diaryActions: {
          addSpendingCategory,
          resetSettings,
        },
        diary,
      }}
    >
      {children}
    </DiaryContext.Provider>
  )
}

// const DiaryProvider = ({ children }) => {
//   const { user } = useAuth();
//   const [diary, setDiary] = useState({});

//   // Use a Ref to store the realm rather than the state because it is not
//   // directly rendered, so updating it should not trigger a re-render as using
//   // state would.
//   const realmRef = useRef(null);

//   useEffect(() => {
//     let config;

//     if (!user) {
//       // if no user is logged in : usage with a realm in local only mode
//       config = {
//         path: 'localOnly.realm',
//         schemaVersion: MODELS_VERSION,
//         schema: Object.values(models).map(m => m.schema),
//       };
//     } else {
//       // if their is a user logged in, open a synced realm
//       // Enables offline-first: open the realm immediately locally without waiting 
//       // for the download of the synchronized realm to be completed.
//       const OpenRealmBehaviorConfiguration = {
//         type: 'openImmediately',
//       };
//       config = {
//         path: 'sync.realm',
//         schemaVersion: MODELS_VERSION,
//         schema: Object.values(models).map(m => m.schema),
//         sync: {
//           user: user,
//           partitionValue: user?.id,
//           newRealmFileBehavior: OpenRealmBehaviorConfiguration,
//           existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
//         },
//       };
//     }

//     // open a realm to manage the diary of the user
//     Realm.open(config).then((diaryRealm) => {
//       realmRef.current = diaryRealm;

//       let userDiary;
//       if (diaryRealm.objects("Diary").length === 0) {
//         diaryRealm.write(() => {
//           userDiary = diaryRealm.create(
//             "Diary",
//             new models.Diary({
//               owner: user?.id
//             })
//           );
//         });
//       } else {
//         userDiary = diaryRealm.objects("Diary")[0];
//       }

//       setDiary(userDiary);
//       userDiary.addListener(() => {
//         setDiary(userDiary);
//       });
//     });

//     return () => {
//       // cleanup function
//       const diaryRealm = realmRef.current;
//       if (diaryRealm) {
//         diaryRealm.close();
//         console.log('Diary realm closed');
//         realmRef.current = null;
//         setDiary({});
//       }
//     };
//   }, [user]);

//   // const updateDiary = (updator) => {
//   //   const diaryRealm = realmRef.current;
//   //   const writeOK = Object.entries(updator).every(([property, updatedValue]) => {
//   //     return (
//   //       property in models.Diary.USER_CAN_UPDATE && // if user can update this property
//   //       models.Diary.USER_CAN_UPDATE[property](updatedValue)  // and did provide a valid new value
//   //     )
//   //   })
    
//   //   if (!writeOK) {
//   //     console.log('You attempted an invalid update on the Diary object');
//   //     return;
//   //   }

//   //   diaryRealm.write(() => {
//   //     Object.entries(updator).forEach(([property, updatedValue]) => {
//   //       diary[property] = updatedValue;
//   //     });
//   //   });
//   // }

//   const addSpendingCategory = (category) => {
//     const diaryRealm = realmRef.current;
//     models.Diary.addSpendingCategory(diaryRealm, diary, category);
//   }

//   const resetDiary = () => {

//   }

//   // Render the children within the DiaryContext's provider. The value contains
//   // everything that should be made available to descendants that use the
//   // useDiary hook.
//   return (
//     <DiaryContext.Provider
//       value={{
//         addSpendingCategory,
//         resetDiary,
//         diary,
//       }}
//     >
//       {children}
//     </DiaryContext.Provider>
//   );
// };

// The useDiary hook can be used by any descendant of the DiaryProvider. It
// provides the diary of the user.
const useDiary = () => {
  const provided = useContext(DiaryContext);
  if (provided == null) {
    throw new Error("useDiary() called outside of a DiaryProvider?"); // an alert is not placed because this is an error for the developer not the user
  }

  return provided.diary;
};

// The useDiaryActions hook can be used by any descendant of the DiaryProvider. It
// provides functions to update the general settings of the user.
const useDiaryActions = () => {
  const provided = useContext(DiaryContext);
  if (provided == null) {
    throw new Error("useDiaryActions() called outside of a DiaryProvider?");
  }

  return provided.diaryActions;
}

export { DiaryProvider, useDiary, useDiaryActions };
