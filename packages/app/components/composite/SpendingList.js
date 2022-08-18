import React from 'react';
import { VStack, Center, Text, Heading } from 'native-base';

import { SpendingCard } from './SpendingCard';

import { useSpendingHistory } from '../../provider/api';
import { useAuth } from '../../provider/authentication';

export const SpendingList = (
  ...boxProps
) => {
  const { value } = useSpendingHistory();
  return (
    <>
      {
        !value || Object.keys(value).length === 0 ?
        <Text fontSize="lg">Aucune dépenses trouvées</Text>
        : Object.entries(value).map(([group, spending]) => {
          return (
            <VStack key={group} alignItems="stretch" w="100%">
              <Center p={1} mb={2} backgroundColor="gray.200">
              <Heading
                _light={{ color: 'gray.700' }}
                _dark={{ color: 'gray.400' }}
                size="lg"
              >{group}</Heading>
              </Center>
              <Center>
                {
                  spending.map(sp => {
                    return (
                      <SpendingCard key={sp._id} spending={sp} w="90%" mb={2} />
                    )
                  })
                }
              </Center>
            </VStack>
          )
        })
      }
    </>
  )
}