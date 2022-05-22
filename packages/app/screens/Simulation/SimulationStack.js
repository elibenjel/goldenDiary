import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { headerOptions } from '../../navigation/native/options';
import { Simulation } from './Simulation';
import React from 'react';

const Stack = createNativeStackNavigator();

export function SimulationStack() {
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({ ...headerOptions(route) })}
    >
      <Stack.Screen
        name="Simulation"
        component={Simulation}
      />
    </Stack.Navigator>
  )
}
