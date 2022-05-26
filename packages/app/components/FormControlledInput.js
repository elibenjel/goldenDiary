import React, { useState } from "react";
import { Box, FormControl, Input, HStack, Menu, IconButton, ChevronDownIcon, TextField, useTheme } from "native-base";
import { Feather } from "../assets/icons";
import { Pressable, Keyboard } from "react-native";

export const FormControlledTextField = (props) => {
  const { label, fieldState, placeholder, InputProps, labelLeftIcon, errorHandler, stackWidth } = props;
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
      <HStack alignItems="center" w={stackWidth} maxW={300}>
        <Input flex={1} placeholder={placeholder} value={value} onChangeText={(newValue) => setValue(newValue)} {...InputProps} />
      </HStack>
      <FormControl.ErrorMessage leftIcon={<Feather size="xs" color="rgb(150,0,0)" />}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
};

const Select = (props) => {
  const { selectState, items, placeholder, InputProps, menuProps } = props;
  const [selectedValue, setSelectedValue] = selectState;

  return (
    <Menu {...menuProps} trigger={triggerProps => {
      return (
          <Pressable onPressIn={() => Keyboard.dismiss()} {...triggerProps}>
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
  )
}

export const FormControlledSelect = (props) => {
  const { label, labelLeftIcon, stackWidth, ...selectProps } = props;
  const [menuWidth, setMenuWidth] = useState(null);
  const [placement, setPlacement] = useState('bottom');
  const onOpen = () => {
    setPlacement('bottom left');
  }
  
  const onLayout = (layoutEvent) => {
    setMenuWidth(layoutEvent.nativeEvent.layout.width);
  }

  const menuProps = { placement, onOpen, w: menuWidth };

  return (
    <FormControl>
      <HStack alignItems="center">
        <FormControl.Label mb="12px">{label}</FormControl.Label>
        {labelLeftIcon ? <Box mt="5px" mb="15px">{labelLeftIcon}</Box> : null}
      </HStack>
      <HStack alignItems="center" w={stackWidth} maxW={300}>
        <Box onLayout={onLayout} flex={1}>
          <Select menuProps={menuProps} {...selectProps} />
        </Box>
      </HStack>
    </FormControl>
  );
};


export const FormControlledDatePicker = (props) => {
  const { colors, fontSizes } = useTheme()
  const { value, onChange } = props;

  const leftZeroPadding = (n) => `${n < 10 ? '0' : ''}${n}`;
  const date = `${value.year}-${leftZeroPadding(value.month)}-${leftZeroPadding(value.day)}`;
  const onInput = (e, d) => {
    const [year, month, day] = d.split('-').map(str => Number(str));
    onChange({ day, month, year });
  }

  return (
    <input type="date" value={date} onInput={onInput} style={{
      appearance: 'none',
      '-webkit-appearance': 'none',
      color: colors.coolGray[400],
      fontSize: fontSizes.xs,
      border: `2px solid #ecf0f1`,
      background: colors.light[50],
      padding: '4px',
    }} />
  )
}
