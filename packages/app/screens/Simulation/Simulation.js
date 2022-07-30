import React from 'react';
import { Link as SolitoLink } from 'solito/link';
import {
  Text,
  VStack,
} from 'native-base';

import { ColorModeSwitch } from '../../components';
import { useSetHeaderRightLayoutEffect } from '../../provider/navigation';

export function Simulation() {
  useSetHeaderRightLayoutEffect();
  return (
    <>
      <VStack alignItems="center" space="md">
        <Text>
          Simulation Page
        </Text>
      </VStack>
      <ColorModeSwitch />
    </>
  )
}
