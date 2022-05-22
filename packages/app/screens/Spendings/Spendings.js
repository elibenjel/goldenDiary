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
import { MaterialCommunityIcons, Feather, Ionicons, AntDesign } from '../../assets/icons';
import { TitledCard, TopLayout, TextPrimary, TextSecondary } from '../../components';
import { useSetHeaderRightLayoutEffect } from '../../provider/navigation';

export function Spendings() {
  useSetHeaderRightLayoutEffect();
  return (
    <TopLayout>
      <VStack flex={1} alignItems="center" mt="4" space="md">
        <TitledCard
          title="Food"
          HeaderRight={<Ionicons name="pencil" size="10" color="black" />}
          TopRightCorner={<Ionicons name="pencil" size="10" color="black" />}
        >
          <TextPrimary>300€</TextPrimary>
          <TextSecondary>{'<400€'}</TextSecondary>
        </TitledCard>
      </VStack>
    </TopLayout>
  )
}
