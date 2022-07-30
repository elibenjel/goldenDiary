import React from 'react';
import { Box, Menu, Pressable } from 'native-base';

import { Icon } from './Icon';

export const OptionMenu = ({
  IconProps,
  groups,
  ...other
}) => {
  return (
    <Box alignItems="flex-start">
      <Menu closeOnSelect={false} defaultIsOpen={false} {...other} trigger={triggerProps => {
        return (
          <Pressable {...triggerProps}>
            <Icon {...IconProps} />
          </Pressable>
        )
      }}>
        {
          groups.map(({
            items,
            props
          }) => {
            return (
              <Menu.OptionGroup key={props.title} {...props}>
                {
                  items.map(({ value, label }) => {
                    return <Menu.ItemOption key={value} value={value}>{label}</Menu.ItemOption>;
                  })
                }
              </Menu.OptionGroup>
            )
          })

        }
      </Menu>
    </Box>
  )
}