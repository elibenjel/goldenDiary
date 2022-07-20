import { MaterialCommunityIcons, Feather, Ionicons, AntDesign } from '../assets/icons';
import { SunIcon } from 'native-base';
import React from 'react';

const mainScreens = {};

mainScreens.Home = {
  title: 'Accueil',
  icon: ({ focused, color, size }) => {
    const IconFamily = focused ? Ionicons : Ionicons;
    const iconName = focused ? 'home' : 'home-outline';
    return React.createElement(IconFamily, { name : iconName, size, color });
  },
  linkTo: '/'
}


mainScreens.Spending = {
  title: 'Dépenses',
  icon: ({ focused, color, size }) => {
    const IconFamily = focused ? Ionicons : Ionicons;
    const iconName = focused ? 'receipt' : 'receipt-outline';
    return React.createElement(IconFamily, { name : iconName, size, color });
  },
  linkTo: '/spending'
}

mainScreens.Budget = {
  title: 'Budget',
  icon: ({ focused, color, size }) => {
    const IconFamily = focused ? MaterialCommunityIcons : MaterialCommunityIcons;
    const iconName = focused ? 'piggy-bank' : 'piggy-bank-outline';
    return React.createElement(IconFamily, { name : iconName, size, color });
  },
  linkTo: '/budget'
}

mainScreens.Simulation = {
  title: 'Simulation',
  icon: ({ focused, color, size }) => {
    const IconFamily = focused ? Ionicons : Ionicons;
    const iconName = focused ? 'bar-chart' : 'bar-chart-outline';
    return React.createElement(IconFamily, { name : iconName, size, color });
  },
  linkTo: '/simulation'
}

mainScreens.Learn = {
  title: 'A propos',
  icon: ({ focused, color, size }) => {
    const IconFamily = focused ? AntDesign : AntDesign;
    const iconName = focused ? 'questioncircle' : 'questioncircleo';
    return React.createElement(IconFamily, { name : iconName, size, color });
  },
  linkTo: '/learn'
}

export { mainScreens };