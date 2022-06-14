import { Link as SolitoLink } from 'solito/link';
import React from 'react';
import {
  Center,
  Image,
  HStack,
  Text,
  Heading,
  Code,
  Link,
  VStack,
  Button,
  AspectRatio,
  Box,
} from 'native-base';
import { ColorModeSwitch, TopLayout } from '../../components';
import { useSetHeaderRightLayoutEffect } from '../../provider/navigation';

export function Budget() {
  useSetHeaderRightLayoutEffect();
  return (
    <TopLayout>
      <VStack alignItems="center" space="md">
        <Text>
          Budget Page
        </Text>
      </VStack>
      <ColorModeSwitch />
    </TopLayout>
  )
}
