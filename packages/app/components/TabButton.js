import React from 'react';
import { Button, Stack } from 'native-base';
import {Link as SolitoLink} from 'solito/link';

export const TabButton = (props) => {
  const { direction, icon, bg, onClick, linkTo, children } = props;
  return (
    <SolitoLink href={linkTo}>
      <Button onClick={onClick} variant="unstyled">
        <Stack direction={direction} flexDir={direction === 'column' ? 'column-reverse' : 'row'} alignItems="center" bg={bg}>
          {React.cloneElement(icon, { m : 2 })}
          {children}
        </Stack>
      </Button>
    </SolitoLink>
  )
}
