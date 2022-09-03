import React, { useContext, useState, useEffect, useRef } from 'react';

import { useRealm } from '../realm';
import { useAuth } from '../authentication';

const DiaryContext = React.createContext(null);

const DiaryProvider = ({ children }) => {
  const { useQuery, useMutations } = useRealm();
  const { user } = useAuth();

  const [diary, setDiary] = useState();
  const diaryOwnerRef = useRef();
  const { loading, retry } = useQuery({
    objectType: 'Diary',
    onSuccess: (data) => {
      setDiary(data[0]);
      diaryOwnerRef.current = data[0]._owner;
      console.log('Opened user Diary');
    }
  });

  const correctDiaryOpened = user?.id ? diaryOwnerRef.current === user?.id : diaryOwnerRef.current === 'local';

  const { mutate } = useMutations({
    mutations: [
      {
        object: { type : 'Diary', id : diary?._id },
        operation: { type : 'update', args : ['spendingCategories'] }
      }
    ]
  });

  useEffect(() => {
    if (!loading && !correctDiaryOpened) {
      console.log('Refetching Diary...')
      retry();
      return;
    }
  }, [loading, correctDiaryOpened]);

  if (!correctDiaryOpened) {
    console.log('User diary not opened yet')
    return (
      <DiaryContext.Provider
        value={{
          diaryActions: {
          },
          diary: undefined,
        }}
      >
      </DiaryContext.Provider>
    )
  }

  const addSpendingCategory = (category) => {
    mutate({
      variables: {
        spendingCategories: [...diary?.spendingCategories, category],
      },
      onSuccess: retry
    });
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
