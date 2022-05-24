import React, { useState } from "react";
import { Box, FormControl, Input, HStack, Menu, IconButton, ChevronDownIcon } from "native-base";
import { Feather } from "../assets/icons";
import { Pressable } from "react-native";

export const FormControlledTextField = (props) => {
  const { label, fieldState, placeholder, InputProps, labelLeftIcon, errorHandler } = props;
  const [value, setValue] = fieldState;

  let isInvalid = false, errorMessage;
  if (errorHandler) {
    errorMessage = errorHandler(value);
    if (errorMessage !== '') {
      isInvalid = true;
    }
  }
  return (
    <FormControl isInvalid={isInvalid}>
      <HStack alignItems="center">
        <FormControl.Label mb="12px">{label}</FormControl.Label>
        {labelLeftIcon ? <Box mt="5px" mb="15px">{labelLeftIcon}</Box> : null}
      </HStack>
      <HStack alignItems="center" w="100vw" maxW={300}>
        <Input flex={1} placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} {...InputProps} />
      </HStack>
      <FormControl.ErrorMessage leftIcon={<Feather size="xs" color="rgb(150,0,0)" />}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
};


export const FormControlledSelect = (props) => {
  const { isInvalid, label, items, selectState, placeholder, InputProps, labelLeftIcon } = props;
  const [selectedValue, setSelectedValue] = selectState;
  const [placement, setPlacement] = useState('');

  return (
    <FormControl isInvalid={isInvalid}>
      <HStack alignItems="center">
        <FormControl.Label mb="12px">{label}</FormControl.Label>
        {labelLeftIcon ? <Box mt="5px" mb="15px">{labelLeftIcon}</Box> : null}
      </HStack>
      <HStack alignItems="center" w="100vw" maxW={300}>
        <Box flex={1}>
          <Menu w={300} onOpen={() => setPlacement('bottom left')} placement={placement} trigger={triggerProps => {
            return (
                <Pressable {...triggerProps}>
                  <Input
                    placeholder={placeholder} value={selectedValue} editable={false}
                    InputRightElement={
                      <ChevronDownIcon size="xs" color="black" mr="2" />
                    }
                    {...InputProps}
                  />
                </Pressable>
            )
          }}>
            {
              items.map(item => <Menu.Item key={item.label} onPress={() => setSelectedValue(item.value)}>{item.label}</Menu.Item>)
            }
          </Menu>
        </Box>
      </HStack>
      <FormControl.ErrorMessage leftIcon={<Feather size="xs" color="rgb(150,0,0)" />}>
        {''}
      </FormControl.ErrorMessage>
    </FormControl>
  );
};
