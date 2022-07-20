import React from 'react';
import { Center, Box, HStack, Stack } from 'native-base';
import { HeaderText, SubHeaderText, FooterText, TextPrimary } from './Typography';


export const LargeTitledCard = (props) => {
  const { title, subtitle, HeaderRight, TopRightCorner, children } = props;
  return (
    <Box w="80" rounded="lg" overflow="hidden" borderWidth="1"
      _dark={{
        borderColor: "coolGray.600",
        backgroundColor: "gray.700"
      }} _light={{
        borderColor: "coolGray.200",
        backgroundColor: "gray.50"
      }} _web={{
        shadow: 2,
        borderWidth: 0
      }}
    >
      <Stack p="4" space={3}>
        <Center position="absolute" top="-10" right="-10">
          {TopRightCorner}
        </Center>
        <Stack space={2}>
          <HStack alignItems="center">
            <HeaderText ml="-1" mr="2">
              {title}
            </HeaderText>
            {HeaderRight}
          </HStack>
          <SubHeaderText ml="-0.5" mt="-1">
            {subtitle}
          </SubHeaderText>
        </Stack>
        {children}
      </Stack>
    </Box>
  )
}

export const MediumTitledCard = (props) => {
  const { title, subtitle, footer, HeaderRight, TopRightCorner, rightContent, children } = props;
  return (
    <Box w="100%" rounded="lg" overflow="hidden" borderWidth="1"
      _dark={{
        borderColor: "coolGray.600",
        backgroundColor: "gray.700"
      }} _light={{
        borderColor: "coolGray.200",
        backgroundColor: "gray.50"
      }} _web={{
        shadow: 2,
        borderWidth: 0
      }}
    >
      <Stack p={1}>
        <Center position="absolute" top="-10" right="-10">
          {TopRightCorner}
        </Center>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mr="8">
          <Stack justifyContent="space-between">
            <Stack>
              <HStack alignItems="center">
                <TextPrimary>
                  {title}
                </TextPrimary>
                {HeaderRight}
              </HStack>
              <SubHeaderText ml="2" mb="2" mt="-1">
                {subtitle}
              </SubHeaderText>
            </Stack>
            <FooterText>{footer}</FooterText>
          </Stack>
          {children}
          {rightContent}
        </Stack>
      </Stack>
    </Box>
  )
}

export const SmallTitledCard = (props) => {
  const { title, subtitle, HeaderRight, TopRightCorner, children } = props;
  return (
    <Box w="80" rounded="lg" overflow="hidden" borderWidth="1"
      _dark={{
        borderColor: "coolGray.600",
        backgroundColor: "gray.700"
      }} _light={{
        borderColor: "coolGray.200",
        backgroundColor: "gray.50"
      }} _web={{
        shadow: 2,
        borderWidth: 0
      }}
    >
      <Stack>
        <Center position="absolute" top="-10" right="-10">
          {TopRightCorner}
        </Center>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mr="16">
          <Stack mt="-2">
            <HStack alignItems="center">
              <HeaderText>
                {title}
              </HeaderText>
              {HeaderRight}
            </HStack>
            <SubHeaderText ml="4" mt="-1">
              {subtitle}
            </SubHeaderText>
          </Stack>
          {children}
        </Stack>
      </Stack>
    </Box>
  )
}