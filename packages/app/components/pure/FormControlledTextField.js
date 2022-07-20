import React from "react";
import { Input, Box } from "native-base";
import { FormControlledInput } from "./FormControlledInput";

const TextField = (props) => {
  const { value, onChangeText, ...other } = props;
  return <Input w="100%" value={value} onChangeText={onChangeText} height="30px" size="xs" {...other} />;
}

export const FormControlledTextField = (props) => {
  const { label, state, labelLeftIcon, errorMessage, ...textFieldProps } = props;
  const [value, setValue] = state;

  return (
    <FormControlledInput
      label={label} labelLeftIcon={labelLeftIcon}
      errorMessage={errorMessage} value={value}
    >
      <Box w={'100%'}>
        <TextField value={value} onChangeText={(newValue) => setValue(newValue)} {...textFieldProps} />
      </Box>
    </FormControlledInput>
  );
};