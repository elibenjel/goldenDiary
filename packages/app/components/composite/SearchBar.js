import React, { useState } from 'react';
import { HStack } from 'native-base';

import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '../../assets/icons';
import { Icon, FormControlledTextField, FormControlledSelect, OptionMenu } from '../pure/';

import { useSpendingHistory } from '../../provider/api';
import {
  POSSIBLE_GROUP_VALUES,
  POSSIBLE_SORT_VALUES,
  POSSIBLE_FILTER_VALUES
} from '../../provider/api/SpendingProvider';

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
  const { formattingOptions : options, format = () => null } = useSpendingHistory();
  const { placeholder } = props;

  const onFilterChange = (filter) => {
    format({ ...options, filter });
  }

  const onSortChange = (sort) => {
    format({ ...options, sort });
  }

  const onSortOrderChange = (descending) => {
    format({ ...options, descending });
  }

  const onGroupChange = (group) => {
    format({ ...options, group });
  }

  const onSearchChange = (search) => {
    format({ ...options, search });
  }
  
  return (
    <HStack w="100%" alignItems="center" justifyContent="space-between">
      <HStack w="75%">
        <FormControlledTextField
          placeholder={placeholder}
          control={{
            value: options?.search,
            setters: { change : onSearchChange },
            valid: true
          }}
          InputLeftElement={<Icon family={MaterialIcons} name="search" size="xs" />}
          height="40px"
        />
      </HStack>
      <HStack w="20%" justifyContent="space-evenly">
        <OptionMenu
          placement="left"
          IconProps={{ family : Ionicons, name : 'filter', size : 'xs', isDisabled: !options }}
          groups={[
            {
              items: POSSIBLE_GROUP_VALUES.map(v => ({ value : v, label : t(v) })),
              props: {
                value: options?.group,
                onChange: onGroupChange,
                title: 'Grouper',
                type: 'radio'
              }
            },
            {
              items: [], // POSSIBLE_FILTER_VALUES.map(v => ({ value : v, label : t(v) })),
              props: {
                value: options?.filter,
                onChange: onFilterChange,
                title: 'Filtrer',
                type: 'checkbox'
              }
            }
          ]}
        />
        <OptionMenu
          placement="left"
          IconProps={{ family : MaterialCommunityIcons, name : 'swap-vertical', size : 'xs', isDisabled: !options }}
          groups={[
            {
              items: POSSIBLE_SORT_VALUES.map(v => ({ value : v, label : t(v) })),
              props: {
                value: options?.sort,
                onChange: onSortChange,
                title: 'Trier',
                type: 'radio'
              }
            },
            {
              items: [{ value : true, label : 'Décendant' }, { value : false, label : 'Ascendant' }],
              props: {
                value: options?.descending,
                onChange: onSortOrderChange,
                title: 'Ordre',
                type: 'radio'
              }
            }
          ]}
        />
      </HStack>
    </HStack>
  )
}