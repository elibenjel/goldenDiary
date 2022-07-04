import React, { useState, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Menu, Pressable } from 'native-base';
// import * as Linking from 'expo-linking';

import { FontAwesome } from '../../assets/icons';
import { Icon } from '../../components/Icon';

const HeaderRight = () => {
  return (
    <Menu defaultIsOpen={false} placement="left" trigger={triggerProps => {
      return (
        <Pressable {...triggerProps}>
          <Icon family={FontAwesome} name="user" size="xs" />
        </Pressable>
      )
    }}>
      <Menu.Item>S'identifier</Menu.Item>
      <Menu.Item>S'inscrire</Menu.Item>
    </Menu>
  )
}

export const useSetHeaderRightLayoutEffect = () => {
  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: HeaderRight,
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
