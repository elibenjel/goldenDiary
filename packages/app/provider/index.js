import React from 'react';
import { NativeBaseProvider } from 'native-base';

import { NavigationProvider } from './navigation';
import { AuthProvider } from './authentication';
import { DiaryProvider } from './api';
import { RealmProvider } from './realm';

export function Provider({ children }) {
  return (
    <NavigationProvider>
      <NativeBaseProvider>
        <AuthProvider>
          <RealmProvider>
            <DiaryProvider>
              {children}
            </DiaryProvider>
          </RealmProvider>
        </AuthProvider>
      </NativeBaseProvider>
    </NavigationProvider>
  )
}

