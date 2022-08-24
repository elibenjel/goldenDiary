import React from 'react';
import { NativeBaseProvider } from 'native-base';

// import { NavigationProvider } from './navigation';
// import { AuthProvider } from './authentication';
// import { DiaryProvider } from './api';
// import { RealmProvider } from './realm';

export function Provider({ children }) {
  return (
    <NativeBaseProvider>
      {/* <AuthProvider>
        <NavigationProvider>
          <RealmProvider>
            <DiaryProvider> */}
              {children}
            {/* </DiaryProvider>
          </RealmProvider>
        </NavigationProvider>
      </AuthProvider> */}
    </NativeBaseProvider>
  )
}

