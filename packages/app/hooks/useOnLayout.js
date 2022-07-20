import React, { useState } from 'react';

export const useOnLayout = () => {
  const [layout, setLayout] = useState();
  const onLayout = (event) => {
    const layout = event.nativeEvent.layout;
    setLayout(layout);
  }

  return {
    onLayout,
    width: layout?.width,
    height: layout?.height,
  }
}