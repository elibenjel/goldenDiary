import React from "react";
import { Box, Select } from "native-base";
import { FormControlledInput } from "./FormControlledInput";


export const FormControlledSelect = (props) => {
  const { label, state, labelLeftIcon, errorMessage, width, items, ...selectProps } = props;
  const [selected, setSelected] = state;

  return (
    <FormControlledInput
      label={label} labelLeftIcon={labelLeftIcon}
      w={width} errorMessage={errorMessage} value={selected}
    >
      <Box w={width}>
        <Select selectedValue={selected} onValueChange={setSelected} size="xs" {...selectProps}>
        {
          items.map(item => <Select.Item key={item.label} label={item.label} value={item.value} />)
        }
        </Select>
      </Box>
    </FormControlledInput>
  );
};