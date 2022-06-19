import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
// import * as Linking from 'expo-linking';
import { useMemo } from 'react';
import {
  Button
} from 'native-base';

export const useSetHeaderRightLayoutEffect = () => {
  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => null} children="User" />
      ),
    });
  }, [navigation]);
}

export function NavigationProvider({ children }) {
  return (
    <NavigationContainer
      linking={useMemo(
        () => ({
          // prefixes: [Linking.createURL('/')],
          config: {
            initialRouteName: '',
            screens: {
              Home: '',
              Spending: 'spending',
              Budget: 'budget',
              Simulation: 'simulation',
              Learn: 'learn'
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

export const InnerWrapper = ({children}) => <>{children}</>;
