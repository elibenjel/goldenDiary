import React from 'react';
import {
  HStack,
  Spinner,
  Heading,
  Center,
  Overlay
} from 'native-base';


export const LoadingSpinner = () => {
  return (
    <Overlay>
      <Center position="absolute" top="50%" left="50%">
        <HStack space={2} justifyContent="center">
          <Spinner accessibilityLabel="Loading posts" />
          <Heading color="primary.500" fontSize="md">
            Loading
          </Heading>
        </HStack>
      </Center>
    </Overlay>
  );
}