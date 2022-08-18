import React, { useContext, useState, useEffect, useRef } from 'react';

import { useRealm } from '../realm';
import { useAuth } from '../authentication';

const DiaryContext = React.createContext(null);

const DiaryProvider = ({ children }) => {
  const { beginTransaction, endTransaction, query, update } = useRealm();
  const { user } = useAuth();

  const [diary, setDiary] = useState();
  const diaryOwnerRef = useRef();
  const correctDiaryOpened = user?.id ? diaryOwnerRef.current === user?.id : diaryOwnerRef.current === 'local';

  useEffect(() => {
    if (!query) {
      return;
    }

    if (correctDiaryOpened) {
      return;
    }
    
    const d = query('Diary')[0];
    if (d) {
      diaryOwnerRef.current = d._owner;
      setDiary(d);
    }
  });

  if (!correctDiaryOpened) {
    return (
      <DiaryContext.Provider
        value={{
          diaryActions: {
          },
          diary: undefined,
        }}
      >
        {children}
      </DiaryContext.Provider>
    )
  }

  const addSpendingCategory = (category) => {
    beginTransaction();
    update({
      object: diary,
      objectType: 'Diary',
      newObjectData: {
        spendingCategories: [...diary.spendingCategories, category]
      },
      onSuccess: () => setDiary(query('Diary')[0])
    });

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
