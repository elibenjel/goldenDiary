import React, { useState } from "react";
import { HStack, Menu, Box, Pressable } from "native-base";

import { Icon } from "../Icon";
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from "../../assets/icons";
import { FormControlledTextField } from "./FormControlledTextField";
import { FormControlledSelect } from "./FormControlledSelect";
import { useSpendingHistory } from "../../provider/api";
import {
  POSSIBLE_GROUP_VALUES,
  POSSIBLE_SORT_VALUES,
  POSSIBLE_FILTER_VALUES
} from "../../provider/api/SpendingHistoryProvider";

const t = (arg) => {
  switch (arg) {
    case 'month':
      return 'Par mois';
    case 'category':
      return 'Par catégorie';
    case 'amount':
      return 'Par montant';
    case 'name':
      return 'Par nom';
    case 'date':
      return 'Par date';
  }
}

export const SearchBar = (props) => {
  const { search, searchFor, options, formatSpendingHistory } = useSpendingHistory()
  const { placeholder } = props;

  const onFilterChange = (filter) => {
    formatSpendingHistory({ ...options, filter });
  }

  const onSortChange = (sort) => {
    formatSpendingHistory({ ...options, sort });
  }

  const onSortOrderChange = (descending) => {
    formatSpendingHistory({ ...options, descending });
  }

  const onGroupChange = (group) => {
    formatSpendingHistory({ ...options, group });
  }
  
  return (
    <HStack w="100%" alignItems="center" justifyContent="space-between">
      <HStack w="75%">
        <FormControlledTextField
          placeholder={placeholder}
          state={[search, searchFor]}
          // borderRadius="4" py="3" px="1" fontSize="14"
          InputLeftElement={<Icon family={MaterialIcons} name="search" size="xs" />}
          height="40px"
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
            <Menu.OptionGroup value={options.group} onChange={onGroupChange} title="Grouper" type="radio">
              {
                POSSIBLE_GROUP_VALUES.map(v => {
                  return <Menu.ItemOption key={v} value={v}>{t(v)}</Menu.ItemOption>;
                })
              }
            </Menu.OptionGroup>
            <Menu.OptionGroup value={options.filter} onChange={onFilterChange} title="Filtrer" type="checkbox">
              {/* <FormControlledSelect /> */}
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
            <Menu.OptionGroup value={options.sort} onChange={onSortChange} title="Trier" type="radio">
              {
                POSSIBLE_SORT_VALUES.map(v => {
                  return <Menu.ItemOption key={v} value={v}>{t(v)}</Menu.ItemOption>;
                })
              }
            </Menu.OptionGroup>
            <Menu.OptionGroup value={options.descending} onChange={onSortOrderChange} title="Ordre" type="radio">
              <Menu.ItemOption value={true}>Décendant</Menu.ItemOption>
              <Menu.ItemOption value={false}>Ascendant</Menu.ItemOption>
            </Menu.OptionGroup>
          </Menu>
        </Box>
      </HStack>
    </HStack>
  )
}