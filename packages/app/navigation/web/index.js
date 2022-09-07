import React from 'react';
import { Stack, Text, Menu, Pressable } from 'native-base';

import { Icon } from '../../components/pure';
import { FontAwesome, FontAwesome5 } from '../../assets/icons';

import { TabView } from '../../components';
import { mainScreens } from '../main-screens';
import { useAuth } from '../../provider/authentication';

const ICON_SIZE = 32;

const HeaderRight = ({ user, signIn, signUp, signOut }) => {

  return (
    <Menu defaultIsOpen={false} placement="left" trigger={triggerProps => {
      return (
        <Pressable {...triggerProps}>
          <Icon family={FontAwesome} name="user" size={ICON_SIZE} color="black" mr={4} />
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

export function WebNavigation(props) {
  const { direction, router, children } = props;
  const bg = 'secondary.100';
  const tabIconColor = 'gray';
  const focusedTabIconColor = 'red';
  const tabIconSize = ICON_SIZE;
  const { user, signIn, signUp, signOut } = useAuth();
  return (
    <>
      <Stack direction={direction} bg={bg} px="1" justifyContent="space-between" alignItems="center" w="100%">
        <Stack direction={direction} alignItems="center" w="15%">
          <Icon family={FontAwesome5} name="journal-whills" size={tabIconSize} color="red" />
          <Text color="black" fontSize="20" fontWeight="bold">
            GOLDEN DIARY
          </Text>
        </Stack>
        <TabView
          router={router} direction={direction} tabs={Object.values(mainScreens)} bg={bg} bgFocused={'secondary.200'}
          tabIconColor={tabIconColor} focusedTabIconColor={focusedTabIconColor}
          tabIconSize={tabIconSize}
        />
        <Stack direction={direction} justifyContent="flex-end" w="15%">
          <HeaderRight user={user} signIn={signIn} signUp={signUp} signOut={signOut} />
        </Stack>
      </Stack>
      {children}
    </>
  )
}
