import React from "react";
import { Input, Box } from "native-base";
import { FormControlledInput } from "./FormControlledInput";

const TextField = (props) => {
  const { value, onChangeText, ...other } = props;
  return <Input _android={{ width : '100%' }} value={value} onChangeText={onChangeText} size="xs" {...other} />;
}

export const FormControlledTextField = (props) => {
  const { label, state, labelLeftIcon, errorMessage, width, ...textFieldProps } = props;
  const [value, setValue] = state;

  return (
    <FormControlledInput
      label={label} labelLeftIcon={labelLeftIcon}
      w={width} errorMessage={errorMessage} value={value}
    >
      <Box w={width}>
        <TextField value={value} onChangeText={(newValue) => setValue(newValue)} {...textFieldProps} />
      </Box>
    </FormControlledInput>
  );
};