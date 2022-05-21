import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Budget, Spendings, Simulation, Learn } from '../../screens';
import React from 'react';
import mainScreens from '../main-screens';

const Tab = createBottomTabNavigator();

const tabBarOptions = (route) => ({
  tabBarIcon: mainScreens[route.name.substring(0, route.name.length - 5)].icon,
  tabBarActiveTintColor: 'tomato',
  tabBarInactiveTintColor: 'gray',
});

export const headerOptions = (route) => ({
  headerStyle: {
    backgroundColor: '#f4511e',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  // headerTitle: props => <MyHeaderApp {...props} />,
});

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
        name="SpendingsStack"
        component={Spendings}
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
