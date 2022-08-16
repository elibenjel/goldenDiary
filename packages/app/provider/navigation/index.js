import React, { useState, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation as useNavigationRN, useRoute } from '@react-navigation/native';
import { Menu, Pressable } from 'native-base';
import { useRouter } from 'solito/router';
import { createParam } from 'solito';
// import * as Linking from 'expo-linking';

import { Icon } from '../../components/pure';
import { FontAwesome } from '../../assets/icons';

import { useAuth } from '../authentication';

const HeaderRight = ({ user, signIn, signUp, signOut }) => {
  // const user = false;
  // const signIn = () => null;
  // const signUp = () => null;
  return (
    <Menu defaultIsOpen={false} placement="left" trigger={triggerProps => {
      return (
        <Pressable {...triggerProps}>
          <Icon family={FontAwesome} name="user" size="xs" color="white" />
        </Pressable>
      )
    }}>
      {
        user ?
        <Menu.Item onPress={signOut}>Se déconnecter</Menu.Item>
        : (
          <>
            <Menu.Item onPress={signIn}>S'identifier</Menu.Item>
            <Menu.Item onPress={signUp}>S'inscrire</Menu.Item>
          </>
        )
      }
    </Menu>
  )
}

export const useSetHeaderRightLayoutEffect = () => {
  const navigation = useNavigationRN();
  const { user, signIn, signUp, signOut } = useAuth();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRight
          user={user}
          signIn={signIn}
          signUp={signUp}
          signOut={signOut}
        />
      ),
    });
  }, [navigation, user]);
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
