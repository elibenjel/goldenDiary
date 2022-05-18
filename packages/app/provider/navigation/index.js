import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import * as Linking from 'expo-linking'
import { useMemo } from 'react'
import {
  Button
} from 'native-base'

export const useSetHeaderRightLayoutEffect = (navigation) => React.useLayoutEffect(() => {
  navigation.setOptions({
    headerRight: () => (
      <Button onPress={() => null} children="User" />
    ),
  });
}, [navigation]);

export function NavigationProvider({ children }) {
  return (
    <NavigationContainer
      linking={useMemo(
        () => ({
          prefixes: [Linking.createURL('/')],
          config: {
            initialRouteName: 'Home',
            screens: {
              Home: '',
              UserDetail: 'user/:id',
            },
          },
        }),
        []
      )}
    >
      {children}
    </NavigationContainer>
  )
}
