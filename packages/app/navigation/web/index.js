import React from "react";
import { Stack, IconButton, Icon, Text } from "native-base";
import mainScreens from '../main-screens';
import { TabView } from '../../components';
import { FontAwesome, FontAwesome5 } from '../../assets/icons';


export function WebNavigation(props) {
  const { direction, router, children } = props;
  const bg = 'primary.100';
  const tabIconColor = 'gray';
  const focusedTabIconColor = 'orange';
  const tabIconSize = 'sm';
  return (
    <>
      <Stack direction={direction} bg={bg} px="1" justifyContent="space-between" alignItems="center" w="100%">
        <Stack direction={direction} alignItems="center">
          <FontAwesome5 name="journal-whills" size="sm" color="yellow" />
          <Text color="black" fontSize="20" fontWeight="bold">
            GOLDEN DIARY
          </Text>
        </Stack>
        <TabView
          router={router} direction={direction} tabs={Object.values(mainScreens)} bg={bg} bgFocused={'secondary.200'}
          tabIconColor={tabIconColor} focusedTabIconColor={focusedTabIconColor}
          tabIconSize={tabIconSize}
        />
        <Stack direction={direction}>
          <IconButton icon={<FontAwesome name="user-circle-o" size="sm" color="black" />} />
        </Stack>
      </Stack>
      {children}
    </>
  )
}
