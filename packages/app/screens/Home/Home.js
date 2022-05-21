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
import { ColorModeSwitch, TopLayout, TitledCard, TextPrimary, TextSecondary } from '../../components';
import { useSetHeaderRightLayoutEffect } from '../../provider/navigation';

export function Home() {
  useSetHeaderRightLayoutEffect();
  return (
    <TopLayout>
      <VStack alignItems="center" justifyContent="space-evenly" p={12} flex={1}>
        <TitledCard
          title="Spendings Overview" subtitle="Chart"
        >
          <TextPrimary>SummaryChart</TextPrimary>
          <TextSecondary>Footer</TextSecondary>
        </TitledCard>
        <TitledCard title="Advise">
          <HStack w="90%" alignItems="center" space={3} px="4">
            <TextPrimary>Advise Advise Advise Advise Advise Advise Advise Advise Advise Advise Advise Advise</TextPrimary>
            <Button size="sm">Try it</Button>
          </HStack>
        </TitledCard>
      </VStack>
      <ColorModeSwitch />
    </TopLayout>
  )
}
