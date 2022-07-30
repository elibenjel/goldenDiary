import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Home, Budget, Spending, Simulation, Learn } from '../../screens';

import { tabBarOptions } from './options';

const Tab = createBottomTabNavigator();

export function NativeNavigation() {
  return (
    <Tab.Navigator
    initialRouteName='HomeStack'
      screenOptions={
        ({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          ...tabBarOptions(route)
        })
      }
    >
      <Tab.Screen
        name="SpendingStack"
        component={Spending}
      />
      <Tab.Screen
        name="BudgetStack"
        component={Budget}
      />
      <Tab.Screen
        name="HomeStack"
        component={Home}
      />
      <Tab.Screen
        name="SimulationStack"
        component={Simulation}
      />
      <Tab.Screen
        name="LearnStack"
        component={Learn}
      />
    </Tab.Navigator>
  )
}
