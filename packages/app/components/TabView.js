import React, { useState } from "react";
import { Stack } from "native-base";
import TabButton from "./TabButton";

export const TabView = (props) => {
  const { direction, tabs, bg, bgFocused, initialIndex = 0, tabIconColor, focusedTabIconColor, tabIconSize } = props;
  const [index, setIndex] = useState(initialIndex);

  return (
    <Stack direction={direction} alignItems="center">
      {
        tabs.map(([title, icon, linkTo], i) => {
          const focused = index === i;
          const color = focused ? focusedTabIconColor : tabIconColor;
          return (
            <TabButton
              key={title}
              direction={direction}
              onClick={() => setIndex(i)}
              icon={icon({ focused, size : tabIconSize, color })} linkTo={linkTo}
              bg={focused ? bgFocused : bg}
            >
              {title}
            </TabButton>
          )
        })
      }
    </Stack>
  )
}
