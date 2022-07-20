import React from 'react';
import { Box } from 'native-base';

import { useSpendingHistory } from '../../provider/api';
import { SpendingCard } from './SpendingCard';


export const SpendingList = (
  ...boxProps
) => {
  const { value } = useSpendingHistory();
  return (
    <Box {...boxProps}>
      {
        value.map(spending => {
          return (
            <SpendingCard spending={spending} w="90%" mb={2} />
          )
        })
      }
    </Box>
  )
}