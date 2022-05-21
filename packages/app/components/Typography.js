import React from 'react';
import { Text, Heading } from 'native-base';

export const HeaderText = (props) => {
  return (
    <Heading
      _light={{ color: 'gray.700' }}
      _dark={{ color: 'gray.400' }}
      size="lg"
      {...props}
    ></Heading>
  )
}

export const SubHeaderText = (props) => {
  return (
    <Text
      fontSize="xs" fontWeight="500"
      _light={{
        color: "violet.500"
      }} _dark={{
        color: "violet.400"
      }}
      {...props}
    ></Text>
  )
}

export const TextPrimary = (props) => {
  return (
    <Text fontWeight="400"
      {...props}
    ></Text>
  )
}

export const TextSecondary = (props) => {
  return (
    <Text fontWeight="300"
      {...props}
    ></Text>
  )
}