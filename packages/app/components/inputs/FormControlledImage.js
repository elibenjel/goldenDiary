import React from "react";
import { Box, FormControl, HStack, Image } from "native-base";
import { Icon } from "../Icon";
import { Feather } from "../../assets/icons";
import { TextSecondary } from '../Typography';

export const FormControlledImage = (props) => {
  const { label, labelLeftIcon, uris, cameraTrigger, ...other } = props;

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
            <TextSecondary>Ajouter une facture</TextSecondary> :
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
        {cameraTrigger}
      </HStack>
    </FormControl>
  )
}