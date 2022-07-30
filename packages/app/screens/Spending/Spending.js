import React from 'react';
import { VStack } from 'native-base';

import { Entypo } from '../../assets/icons';
import { Icon } from '../../components/pure/Icon';
import { SearchBar, SpendingList, SpendingModal } from '../../components/composite';

import { useSpendingActions } from '../../provider/api';

export const Spending = () => {
  const { focus } = useSpendingActions();
  return (
    <>
      <VStack flex={1} w='90%' my="4" alignItems="center" justifyContent="space-between" >
        <VStack w='100%' alignItems="center" space="md">
          <SearchBar placeholder="Rechercher" />
          <SpendingList w="100%" />
        </VStack>
        <Icon onPress={() => focus()} family={Entypo} name='add-to-list' size="xs" color="black" />
      </VStack>
      <SpendingModal />
    </>
  )
}