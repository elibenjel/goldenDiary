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
import { ColorModeSwitch, TopLayout, LargeTitledCard, TextPrimary, TextSecondary } from '../../components';
import { useSetHeaderRightLayoutEffect } from '../../provider/navigation';

export function Home() {
  useSetHeaderRightLayoutEffect();
  return (
    <TopLayout>
      <VStack alignItems="center" justifyContent="space-evenly" p={12} flex={1}>
        <LargeTitledCard
          title="Spending Overview" subtitle="Chart" p="4"
        >
          <TextPrimary>SummaryChart</TextPrimary>
          <TextSecondary>Footer</TextSecondary>
        </LargeTitledCard>
        <LargeTitledCard title="Advise" p="4">
          <HStack w="90%" alignItems="center" space={3} px="4">
            <TextPrimary>Advise Advise Advise Advise Advise Advise Advise Advise Advise Advise Advise Advise</TextPrimary>
            <Button size="sm">Try it</Button>
          </HStack>
        </LargeTitledCard>
      </VStack>
      <ColorModeSwitch />
    </TopLayout>
  )
}
