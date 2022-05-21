import React from "react";
import { Center } from 'native-base';

export const TopLayout = (props) => {
  const { children } = props;
  return (
    <Center
      flex={1}
      _dark={{ bg: 'primary.900' }}
      _light={{ bg: 'primary.50' }}
    >
      {children}
    </Center>
  )
}