import React from 'react';
import { Platform } from 'react-native';
import { IconButton } from 'native-base';

const ICON_SIZE = { xs : 20 }
const ICON_SIZE_WEB = { xs : 10 };

export const Icon = (props) => {
  const { family, name, size : sizeProp, color, ...buttonProps } = props;
  let size = Platform.OS === 'web' ? ICON_SIZE_WEB[sizeProp] : ICON_SIZE[sizeProp];
  if (!size) {
    size = sizeProp
  }

  return (
    <IconButton
      {...buttonProps} disabled={(Object.keys(buttonProps).length === 0) || buttonProps.disabled}
      icon={React.createElement(family, { name, size, color })}
    />
  )
}