import React from "react";
import { Stack, IconButton, Icon, Text, CheckIcon } from "native-base";
// import { FontAwesome, FontAwesome5 } from "react-nat";
import mainScreens from '../main-screens';
import { TabView } from '../../components';


export function WebNavigation(props) {
  const { direction, children } = props;
  const bg = 'secondary.100';
  const tabIconColor = 'gray';
  const focusedTabIconColor = 'orange';
  const tabIconSize = 'sm';
  return (
    <>
      <Stack direction={direction} bg={bg} px="1" py="3" justifyContent="space-between" alignItems="center" w="100%">
        <Stack direction={direction} alignItems="center">
          <CheckIcon size="sm" color="yellow" />
          <Text color="white" fontSize="20" fontWeight="bold">
            GOLDEN DIARY
          </Text>
        </Stack>
        {/* <TabView
          direction={direction} tabs={Object.values(mainScreens)} bg={bg} bgFocused={'secondary.200'}
          tabIconColor={tabIconColor} focusedTabIconColor={focusedTabIconColor}
          tabIconSize={tabIconSize}
        /> */}
        <Stack direction={direction}>
          <IconButton icon={<CheckIcon size="sm" color="white" />} />
        </Stack>
      </Stack>
      {children}
    </>
  )
}
