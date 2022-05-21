import React from 'react';
import { Center, Box, HStack, Stack } from 'native-base';
import { HeaderText, SubHeaderText } from './Typography';


export const TitledCard = (props) => {
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
        <Stack space={2}>
          <Center position="absolute" top="-10" right="-10">
            {TopRightCorner}
          </Center>
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