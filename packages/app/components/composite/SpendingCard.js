import React from 'react';
import { Pressable, VStack, Center, Text } from 'native-base';

import { useSpendingActions } from '../../provider/api';

export const SpendingCard = ({
  spending,
  ...boxProps
}) => {
  const { focus, remove } = useSpendingActions();
  return (
    <Box {...boxProps}>
      <Pressable onPress={() => {
        focus(spending)
      }}>
        <VStack p={1} w="100%" h="80px" rounded="lg" overflow="hidden" borderWidth="1"
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
          alignItems="flex-start"
        >
          <Center>
            <Text fontSize="lg">{spending.name}</Text>
          </Center>
          <Center mt="-1">
            <Text fontSize="xs">{spending.category}</Text>
          </Center>
          <Center position="absolute" top="-10" right="-10">
            <Icon
              family={Entypo}
              name="cross"
              size="xs"
              color="black"
              onPress={remove}
            />
          </Center>
          <Center position="absolute" left="1" bottom="0">
            <Text fontSize="10" fontWeight="500" color="red.900">{spending.when}</Text>
          </Center>
          <Center position="absolute" bottom="30%" right="20">
            <Text fontSize="2xl">{spending.amount}€</Text>
          </Center>
        </VStack>
      </Pressable>
    </Box>
  )
}