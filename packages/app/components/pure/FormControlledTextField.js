import React from 'react';
import { Input, Box } from 'native-base';

import { FormControlledInput } from './FormControlledInput';

const TextField = (props) => {
  const { value, onChangeText, ...other } = props;
  return <Input w="100%" value={value} onChangeText={onChangeText} height="30px" size="xs" {...other} />;
}

export const FormControlledTextField = (props) => {
  const { label, control, showError, errorMessage, labelLeftIcon, ...textFieldProps } = props;
  const { value, setters, valid } = control;

  return (
    <FormControlledInput
      label={label}
      labelLeftIcon={labelLeftIcon}
      isInvalid={!valid && showError}
      errorMessage={errorMessage}
    >
      <Box w={'100%'}>
        <TextField value={value} onChangeText={(newValue) => setters.change(newValue)} {...textFieldProps} />
      </Box>
    </FormControlledInput>
  );
};