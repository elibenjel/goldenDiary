import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { headerOptions } from '../../navigation/native';
import { Budget } from './Budget';
import React from 'react';

const Stack = createNativeStackNavigator();

export function BudgetStack() {
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({ ...headerOptions(route) })}
    >
      <Stack.Screen
        name="Budget"
        component={Budget}
      />
    </Stack.Navigator>
  )
}
