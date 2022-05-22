import { MaterialCommunityIcons, Feather, Ionicons, AntDesign } from '../assets/icons';
import { SunIcon } from 'native-base';
import React from 'react';

const mainScreens = {};

mainScreens.Home = {
  title: 'Home',
  icon: ({ focused, color, size }) => {
    const IconFamily = focused ? Ionicons : Ionicons;
    const iconName = focused ? 'home' : 'home-outline';
    return React.createElement(IconFamily, { name : iconName, size, color });
  },
  linkTo: '/'
}


mainScreens.Spendings = {
  title: 'Spendings',
  icon: ({ focused, color, size }) => {
    const IconFamily = focused ? Ionicons : Ionicons;
    const iconName = focused ? 'receipt' : 'receipt-outline';
    return React.createElement(IconFamily, { name : iconName, size, color });
  },
  linkTo: '/spendings'
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
  title: 'Learn',
  icon: ({ focused, color, size }) => {
    const IconFamily = focused ? AntDesign : AntDesign;
    const iconName = focused ? 'questioncircle' : 'questioncircleo';
    return React.createElement(IconFamily, { name : iconName, size, color });
  },
  linkTo: '/learn'
}

export default mainScreens;