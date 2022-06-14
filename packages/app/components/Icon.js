import React from "react";
import { IconButton } from "native-base";
import { Platform } from "react-native";

const ICON_SIZE_WEB = { xs : '10' };

export const Icon = (props) => {
  const { family, name, size : sizeProp, color, ...buttonProps } = props;
  let size = Platform.OS === 'web' ? ICON_SIZE_WEB[sizeProp] : sizeProp;
  if (!size) {
    size = sizeProp
  }

  return (
    <IconButton
      {...buttonProps} disabled={Object.keys(buttonProps).length === 0}
      icon={React.createElement(family, { name, size, color })}
    />
  )
}