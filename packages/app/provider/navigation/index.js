import React, { useState, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation as useNavigationRN, useRoute } from '@react-navigation/native';
import { Menu, Pressable } from 'native-base';
import { useRouter } from 'solito/router';
import { createParam } from 'solito';
// import * as Linking from 'expo-linking';

import { Icon } from '../../components/pure';
import { FontAwesome } from '../../assets/icons';

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
  const navigation = useNavigationRN();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: HeaderRight,
    });
  }, [navigation]);
}

const NavigationContext = React.createContext(null);
const useParam = createParam();

export const NavigationProvider = ({ children }) => {
  const { push : solitoPush, back } = useRouter();
  const push = (route, params = {}) => {
    solitoPush({
      pathname: route,
      query: params,
    });
  }
  
  return (
    <NavigationContext.Provider
      value={{
        push,
        back,
        getRoute : () => useRoute().name,
        getParam : () => useRoute().params
      }}
    >
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
        // onStateChange={(newState) => setNavigationState(newState)}
      >
        {children}
      </NavigationContainer>
    </NavigationContext.Provider>
  )
}

// The useDiary hook can be used by any descendant of the DiaryProvider. It
// provides the diary of the user and functions to
// update and reset the diary.
export const useNavigation = () => {
  const navigation = useContext(NavigationContext);
  if (navigation == null) {
    throw new Error("useNavigation() called outside of a NavigationProvider?"); // an alert is not placed because this is an error for the developer not the user
  }
  return navigation;
};

export const InnerWrapper = ({children}) => <>{children}</>;
