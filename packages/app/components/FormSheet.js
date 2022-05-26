import React from "react";
import { Center, Actionsheet } from "native-base";
import { Keyboard, Platform } from 'react-native';
import { Animated } from 'react-native';

const useKeyboardBottomInset = () => {
  const [bottom, setBottom] = React.useState(0);
  const subscriptions = React.useRef([]);

  React.useEffect(() => {
    subscriptions.current = [
      Keyboard.addListener('keyboardDidHide', (e) => setBottom(0)),
      Keyboard.addListener('keyboardDidShow', (e) => {
        if (Platform.OS === 'android') {
          setBottom(e.endCoordinates.height);
        } else {
          setBottom(
            Math.max(e.startCoordinates.height, e.endCoordinates.height)
          );
        }
      }),
    ];

    return () => {
      subscriptions.current.forEach((subscription) => {
        subscription.remove();
      });
    };
  }, [setBottom, subscriptions]);

  return bottom;
};

export const FormSheet = (props) => {
  const { disclose, childrenKeys, children } = props
  const {
    isOpen,
    onClose
  } = disclose;

  const bottomInset = useKeyboardBottomInset();
  const bottomAni = React.useRef(new Animated.Value(bottomInset)).current;

  React.useEffect(() => {
    Animated.timing(bottomAni, {
      toValue: bottomInset,
      duration: 500,
      useNativeDriver: false
    }).start();
  }, [bottomInset]);

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Animated.View w="100%" bottom={bottomAni}>
        <Actionsheet.Content pb="8">
          {
            children.map((child, index) => (
              <Actionsheet.Item key={childrenKeys[index]} justifyContent="center" disabled>
                {child}
              </Actionsheet.Item>
            ))
          }
        </Actionsheet.Content>
      </Animated.View>
      </Actionsheet>
  );
}