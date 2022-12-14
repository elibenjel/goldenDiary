import React from 'react';
import { Box, FormControl, HStack, Image, Text } from 'native-base';

import { Icon } from './Icon';
import { Feather } from '../../assets/icons';

export const FormControlledImage = (props) => {
  const { label, labelLeftIcon, uris, updateController, ...other } = props;

  return (
    <FormControl w={'100%'} {...other}>
      {
        label ?
        <HStack alignItems="center">
          <FormControl.Label mb="12px">{label}</FormControl.Label>
          {labelLeftIcon ? <Box mt="5px" mb="15px">{labelLeftIcon}</Box> : null}
        </HStack>
        : null
      }
      <HStack alignItems="center" justifyContent="space-evenly" w={'100%'}>
        <HStack alignItems="center" justifyContent="flex-start">
          {
            !uris?.length ?
            <Text>Ajouter une facture</Text> :
            uris.map((uri, i) => (
              <Box key={uri} mr={1}>
              {
                i < 2 ?
                <Image source={{ uri }} size="xs" />
                : <Icon family={Feather} name="more-horizontal" size="xs" />
              }
              </Box>
            )).slice(0, 3)
          }
        </HStack>
        { updateController }
      </HStack>
    </FormControl>
  )
}