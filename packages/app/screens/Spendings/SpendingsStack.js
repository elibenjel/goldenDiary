import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { headerOptions } from '../../navigation/native';
import { Spendings } from './Spendings';
import React from 'react';

const Stack = createNativeStackNavigator();

export function SpendingsStack() {
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({ ...headerOptions(route) })}
    >
      <Stack.Screen
        name="Spendings"
        component={Spendings}
      />
    </Stack.Navigator>
  )
}
