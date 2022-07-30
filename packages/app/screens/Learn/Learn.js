import React from 'react';
import { Link as SolitoLink } from 'solito/link';
import {
  Text,
  VStack,
} from 'native-base';

import { ColorModeSwitch } from '../../components';
import { useSetHeaderRightLayoutEffect } from '../../provider/navigation';

export function Learn() {
  useSetHeaderRightLayoutEffect();
  return (
    <>
      <VStack alignItems="center" space="md">
        <Text>
          Learn Page
        </Text>
      </VStack>
      <ColorModeSwitch />
    </>
  )
}
