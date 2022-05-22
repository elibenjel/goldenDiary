console.log('importing in homestack')
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { headerOptions } from '../../navigation/native/options';
import { Home } from './Home';
import { UserDetail } from './UserDetail';
import React from 'react';

const Stack = createNativeStackNavigator();

export function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({ ...headerOptions(route) })}
    >
      <Stack.Screen
        name="Home"
        component={Home}
      />
      <Stack.Screen
        name="UserDetail"
        component={UserDetail}
        options={{
            title: 'Details'
        }}
      />
    </Stack.Navigator>
  )
}
