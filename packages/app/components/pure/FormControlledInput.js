import React from 'react';
import { Box, FormControl, HStack, WarningOutlineIcon } from 'native-base';

export const FormControlledInput = (props) => {
  const { label, labelLeftIcon, isInvalid, errorMessage = '', children, ...other } = props;

  return (
    <FormControl isInvalid={isInvalid} w={'100%'} {...other}>
      {
        label ?
        <HStack alignItems="center">
          <FormControl.Label mb="8px">{label}</FormControl.Label>
          {labelLeftIcon ? <Box mt="5px" mb="8px">{labelLeftIcon}</Box> : null}
        </HStack>
        : null
      }
      <Box alignItems="center" w={'100%'}>
        {children}
      </Box>
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}





