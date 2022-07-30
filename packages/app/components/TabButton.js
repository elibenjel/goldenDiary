import React from 'react';
import { Button, Stack } from 'native-base';
import { Link as SolitoLink } from 'solito/link';

export const TabButton = (props) => {
  const { direction, icon, bg, onPress, linkTo, children } = props;
  return (
    <SolitoLink href={linkTo}>
      <Button onPress={onPress} variant="unstyled" bg={bg}>
        <Stack direction={direction} flexDir={direction === 'column' ? 'column-reverse' : 'row'} alignItems="center">
          {React.cloneElement(icon, { m : 2 })}
          {children}
        </Stack>
      </Button>
    </SolitoLink>
  )
}
