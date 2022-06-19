import React, { useState } from "react";
import { Box, Input, Menu, ChevronDownIcon } from "native-base";
import { Pressable, Keyboard } from "react-native";
import { FormControlledInput } from "./FormControlledInput";

const SIZE = { xs : 10 };

const Select = (props) => {
  const { selected, setSelected, items, menuProps, size : sizeProp, ...other } = props;
  let size = SIZE[sizeProp];

  return (
    <Menu {...menuProps} trigger={triggerProps => {
      return (
          <Pressable onPressIn={() => Keyboard.dismiss()} {...triggerProps}>
            <Input
              value={selected} editable={false}
              InputRightElement={
                <ChevronDownIcon size={10} color="black" mr="2" />
              }
              size={size}
              {...other}
            />
          </Pressable>
      )
    }}>
      {
        items.map(item => <Menu.Item key={item.label} onPress={() => setSelected(item.value)}>{item.label}</Menu.Item>)
      }
    </Menu>
  )
}

export const FormControlledSelect = (props) => {
  const { label, state, labelLeftIcon, errorMessage, width, ...selectProps } = props;
  const [selected, setSelected] = state;
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
    <FormControlledInput
      label={label} labelLeftIcon={labelLeftIcon}
      w={width} errorMessage={errorMessage} value={selected}
    >
      <Box onLayout={onLayout} w={width} flex={1}>
        <Select selected={selected} setSelected={setSelected} menuProps={menuProps} {...selectProps} />
      </Box>
    </FormControlledInput>
  );
};