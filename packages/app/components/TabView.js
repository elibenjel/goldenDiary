import React, { useState } from 'react';
import { Stack } from 'native-base';

import { TabButton } from './TabButton';

export const TabView = (props) => {
  const { router, direction, tabs, bg, bgFocused, tabIconColor, focusedTabIconColor, tabIconSize } = props;
  let initialIndex = 0;
  tabs.forEach(({ linkTo }, i) => {
    if (linkTo === router.pathname) {
      initialIndex = i;
    }
  });

  const [index, setIndex] = useState(initialIndex);

  return (
    <Stack direction={direction} alignItems="center">
      {
        tabs.map(({ title, icon, linkTo }, i) => {
          const focused = index === i;
          const color = focused ? focusedTabIconColor : tabIconColor;
          return (
            <TabButton
              key={title}
              direction={direction}
              onPress={() => setIndex(i)}
              icon={icon({ focused, size : tabIconSize, color })} linkTo={linkTo}
              bg={focused ? bgFocused : bg}
              divider={i < tabs.length - 1 ? true : false}
            >
              {title}
            </TabButton>
          )
        })
      }
    </Stack>
  )
}
