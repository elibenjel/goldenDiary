import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { headerOptions } from '../../navigation/native/options';
import { Learn } from './Learn';
import React from 'react';

const Stack = createNativeStackNavigator();

export function LearnStack() {
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({ ...headerOptions(route) })}
    >
      <Stack.Screen
        name="Learn"
        component={Learn}
      />
    </Stack.Navigator>
  )
}
