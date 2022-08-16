import React from 'react';
import {
  Alert,
  VStack,
  HStack,
  Text
} from 'native-base';

export const AlertSubtle = ({
  color,
  text
}) => {
  return (
    <Alert w="100%" variant="subtle" colorScheme={color} status={color}>
      <VStack space={2} flexShrink={1} w="100%">
        <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text color="coolGray.800">
              {text}
            </Text>
          </HStack>
        </HStack>
      </VStack>
    </Alert>
  )
}