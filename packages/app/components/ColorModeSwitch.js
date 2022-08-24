import React from 'react';
import {
  useColorMode,
  Tooltip,
  IconButton,
  SunIcon,
  MoonIcon,
} from 'native-base';
import { Platform } from 'react-native';

export function ColorModeSwitch() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Tooltip
      label={colorMode === 'dark' ? 'Enable light mode' : 'Enable dark mode'}
      placement="bottom right"
      openDelay={300}
      closeOnClick={false}
    >
      <IconButton
        position="absolute"
        top={4}
        right={2}
        _web={{
          top: undefined,
          bottom: 8,
        }}
        onPress={toggleColorMode}
        icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
        accessibilityLabel="Color Mode Switch"
      />
    </Tooltip>
  )
}
