import React from "react";
import { Input, Box } from "native-base";
import { FormControlledInput } from "./FormControlledInput";

const TextField = (props) => {
  const { value, onChangeText, ...other } = props;
  return <Input flex={1} value={value} onChangeText={(newValue) => setValue(newValue)} {...other} />;
}

export const FormControlledTextField = (props) => {
  const { label, state, labelLeftIcon, errorHandler, width, ...textFieldProps } = props;
  const [value, setValue] = state;

  return (
    <FormControlledInput
      label={label} labelLeftIcon={labelLeftIcon}
      w={width} errorHandler={errorHandler} value={value}
    >
      <Box w={width}>
        <TextField value={value} onChangeText={(newValue) => setValue(newValue)} {...textFieldProps} />
      </Box>
    </FormControlledInput>
  );
};