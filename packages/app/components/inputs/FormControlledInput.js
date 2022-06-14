import React from "react";
import { Box, FormControl, HStack } from "native-base";
import { MaterialIcons } from "../../assets/icons";
import { MAX_FIELD_WIDTH } from "./constants";

export const FormControlledInput = (props) => {
  const { label, labelLeftIcon, w, children, errorMessage = '', value, ...other } = props;

  return (
    <FormControl isInvalid={isInvalid} w={w} {...other}>
      <HStack alignItems="center">
        <FormControl.Label mb="12px">{label}</FormControl.Label>
        {labelLeftIcon ? <Box mt="5px" mb="15px">{labelLeftIcon}</Box> : null}
      </HStack>
      <Box alignItems="center" w={w} maxW={MAX_FIELD_WIDTH}>
        {children}
      </Box>
      <FormControl.ErrorMessage leftIcon={<MaterialIcons name="cross" size="xs" color="error.200" />}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}





