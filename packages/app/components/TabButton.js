import React from 'react';
import { Box, Button, Divider, Stack } from 'native-base';
import { Link as SolitoLink } from 'solito/link';

export const TabButton = (props) => {
  const { direction, icon, bg, onPress, linkTo, divider, children } = props;
  return (
    <SolitoLink href={linkTo}>
      <Stack height="70px" direction={direction} flexDir={direction === 'column' ? 'column-reverse' : 'row'} alignItems="center">
        <Button onPress={onPress} variant="unstyled" bg={bg}>
            <Stack direction={direction} flexDir={direction === 'column' ? 'column-reverse' : 'row'} alignItems="center">
              {React.cloneElement(icon, { mr : 2 })}
              {children}
            </Stack>
        </Button>
        {divider && <Divider ml={1} orientation="vertical" />}
      </Stack>
    </SolitoLink>
  )
}
