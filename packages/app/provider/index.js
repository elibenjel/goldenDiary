import React from 'react'

import { NavigationProvider } from './navigation'
import { NativeBaseProvider } from 'native-base'
import { AuthProvider } from './authentication'
import { DiaryProvider } from './api';

export function Provider({ children }) {
  return (
    <NavigationProvider>
      <NativeBaseProvider>
        <AuthProvider>
          <DiaryProvider>
            {children}
          </DiaryProvider>
        </AuthProvider>
      </NativeBaseProvider>
    </NavigationProvider>
  )
}

