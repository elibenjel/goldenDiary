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
import { ColorModeSwitch } from '../../components';
import { useNavigation } from '@react-navigation/native';
import { useSetHeaderRightLayoutEffect } from '../../provider/navigation';

export function Spendings() {
  const navigation = useNavigation();
  useSetHeaderRightLayoutEffect(navigation);
  return (
    <Center
      flex={1}
      _dark={{ bg: 'blueGray.900' }}
      _light={{ bg: 'blueGray.50' }}
    >
      <VStack alignItems="center" space="md">
        <Text>
          Spendings Page
        </Text>
      </VStack>
      <ColorModeSwitch />
    </Center>
  )
}
