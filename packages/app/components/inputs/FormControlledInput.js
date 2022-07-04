import React from "react";
import { Box, FormControl, HStack, WarningOutlineIcon } from "native-base";

export const FormControlledInput = (props) => {
  const { label, labelLeftIcon, errorMessage = '', value, children, ...other } = props;
  const isInvalid = value !== '' && errorMessage.length > 0;

  return (
    <FormControl isInvalid={isInvalid} w={'100%'} {...other}>
      {
        label ?
        <HStack alignItems="center">
          <FormControl.Label mb="12px">{label}</FormControl.Label>
          {labelLeftIcon ? <Box mt="5px" mb="15px">{labelLeftIcon}</Box> : null}
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





