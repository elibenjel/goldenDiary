import React from "react";
import { Box, FormControl, HStack, WarningOutlineIcon } from "native-base";
import { Icon } from "../Icon";
import { Entypo } from "../../assets/icons";
import { MAX_FIELD_WIDTH } from "./constants";

export const FormControlledInput = (props) => {
  const { label, labelLeftIcon, w, errorMessage = '', value, children, ...other } = props;
  const isInvalid = value !== '' && errorMessage.length > 0;

  return (
    <FormControl isInvalid={isInvalid} w={w} {...other}>
      <HStack alignItems="center">
        <FormControl.Label mb="12px">{label}</FormControl.Label>
        {labelLeftIcon ? <Box mt="5px" mb="15px">{labelLeftIcon}</Box> : null}
      </HStack>
      <Box alignItems="center" w={w} maxW={MAX_FIELD_WIDTH}>
        {children}
      </Box>
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}





