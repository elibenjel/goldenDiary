import React from 'react';
import { Platform } from 'react-native';
import { Box, IconButton } from 'native-base';

const ICON_SIZE = { xs : 20 }
const ICON_SIZE_WEB = { xs : 10 };

export const Icon = (props) => {
  const { family, name, size : sizeProp, color, ...otherProps } = props;
  let size = Platform.OS === 'web' ? ICON_SIZE_WEB[sizeProp] : ICON_SIZE[sizeProp];
  if (!size) {
    size = sizeProp
  }

  if ('onPress' in otherProps || 'disabled' in otherProps) {
    return (
      <IconButton
        {...otherProps} icon={React.createElement(family, { name, size, color })}
      />
    )
  }
  
  return (
    <Box {...otherProps}>
      {React.createElement(family, { name, size, color })}
    </Box>
  )
}