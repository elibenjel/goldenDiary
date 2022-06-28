import React, { useState } from "react";
import { FormControlledTextField } from "./FormControlledTextField";
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from "../../assets/icons";
import { Icon } from "../Icon";
import { HStack, Menu, Box, Pressable } from "native-base";
import { useSpendingHistory } from "../../provider/api";

export const SearchBar = (props) => {
  const { search, searchFor, options, filtered, sorted } = useSpendingHistory()
  const { placeholder } = props;
  
  return (
    <>
      <HStack w="100%" justifyContent="space-between">
        <HStack w="75%">
          <FormControlledTextField
            placeholder={placeholder}
            state={[search, searchFor]}
            // borderRadius="4" py="3" px="1" fontSize="14"
            InputLeftElement={<Icon family={MaterialIcons} name="search" size="xs" />}
            // InputRightElement={<Icon m="2" mr="3" size="6" color="gray.400" as={<MaterialIcons name="mic" />} />}
          />
        </HStack>
        <HStack w="20%" justifyContent="space-evenly">
          <Box alignItems="flex-start">
            <Menu closeOnSelect={false} defaultIsOpen={false} placement="left" trigger={triggerProps => {
              return (
                <Pressable {...triggerProps}>
                  <Icon family={Ionicons} name="filter" size="xs" />
                </Pressable>
              )
            }}>
              <Menu.OptionGroup value={options.filter} onChange={filtered} title="Filtrer" type="radio">
                <Menu.ItemOption value="month">Ce mois</Menu.ItemOption>
                <Menu.ItemOption value="year">Cette année</Menu.ItemOption>
              </Menu.OptionGroup>
            </Menu>
          </Box>
          <Box alignItems="flex-start">
            <Menu closeOnSelect={false} defaultIsOpen={false} placement="left" trigger={triggerProps => {
              return (
                <Pressable {...triggerProps}>
                  <Icon family={MaterialCommunityIcons} name="swap-vertical" size="xs" />
                </Pressable>
              )
            }}>
              <Menu.OptionGroup value={options.sort} onChange={sorted} title="Trier" type="radio">
                <Menu.ItemOption value="name">Par nom</Menu.ItemOption>
                <Menu.ItemOption value="date">Par date</Menu.ItemOption>
                <Menu.ItemOption value="amount">Par montant</Menu.ItemOption>
              </Menu.OptionGroup>
            </Menu>
          </Box>
        </HStack>
      </HStack>
    </>
  )
}