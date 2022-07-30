import React from 'react';
import { Box, Select } from 'native-base';

import { FormControlledInput } from './FormControlledInput';

export const FormControlledSelect = (props) => {
  const { label, labelLeftIcon, showError, control, items, errorMessage, ...selectProps } = props;
  const { value, setters, valid } = control;

  return (
    <FormControlledInput
      label={label} labelLeftIcon={labelLeftIcon}
      errorMessage={showError ? errorMessage : ''}
      isInvalid={!valid && showError}
      valid={valid}
    >
      <Box w={'100%'}>
        <Select selectedValue={value} onValueChange={setters.change} height="30" size="xs" {...selectProps}>
        {
          items.map(item => <Select.Item key={item.label} label={item.label} value={item.value} />)
        }
        </Select>
      </Box>
    </FormControlledInput>
  );
};