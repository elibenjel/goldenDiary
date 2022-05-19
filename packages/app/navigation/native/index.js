import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import { HomeStack } from '../../screens/Home';
import { BudgetStack } from '../../screens/Budget';
import { SpendingsStack } from '../../screens/Spendings';
import { SimulationStack } from '../../screens/Simulation';
import { LearnStack } from '../../screens/Learn';
import React from 'react';

const Tab = createBottomTabNavigator();

const tabBarOptions = (route) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let IconFamily;
    let iconName;

    if (route.name === 'HomeStack') {
      IconFamily = focused ? Ionicons : Ionicons;
      iconName = focused ? 'home' : 'home-outline';
    } else if (route.name === 'BudgetStack') {
      IconFamily = focused ? MaterialCommunityIcons : MaterialCommunityIcons;
      iconName = focused ? 'piggy-bank' : 'piggy-bank-outline';
    } else if (route.name === 'SpendingsStack') {
      IconFamily = focused ? Ionicons : Ionicons;
      iconName = focused ? 'receipt' : 'receipt-outline';
    } else if (route.name === 'LearnStack') {
      IconFamily = focused ? AntDesign : AntDesign;
      iconName = focused ? 'questioncircle' : 'questioncircleo';
    } else if (route.name === 'SimulationStack') {
      IconFamily = focused ? Ionicons : Ionicons;
      iconName = focused ? 'bar-chart' : 'bar-chart-outline';
    }

    // You can return any component that you like here!
    return React.createElement(IconFamily, { name : iconName, size, color });
  },
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
        component={SpendingsStack}
      />
      <Tab.Screen
        name="BudgetStack"
        component={BudgetStack}
      />
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
      />
      <Tab.Screen
        name="SimulationStack"
        component={SimulationStack}
      />
      <Tab.Screen
        name="LearnStack"
        component={LearnStack}
      />
    </Tab.Navigator>
  )
}
