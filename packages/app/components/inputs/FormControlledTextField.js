import React from "react";
import { Input, Box } from "native-base";
import { FormControlledInput } from "./FormControlledInput";

const SIZE = { xs : 10 };

const TextField = (props) => {
  const { value, onChangeText, size : sizeProp, ...other } = props;
  let size = SIZE[sizeProp];
  return <Input flex={1} value={value} onChangeText={onChangeText} size={size} {...other} />;
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