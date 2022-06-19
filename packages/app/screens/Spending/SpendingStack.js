import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { headerOptions } from '../../navigation/native/options';
import { Spending } from './Spending';
import React from 'react';

const Stack = createNativeStackNavigator();

export const SpendingStack = () => {
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({ ...headerOptions(route) })}
    >
      <Stack.Screen
        name="Spending"
        component={Spending}
      />
    </Stack.Navigator>
  )
}
