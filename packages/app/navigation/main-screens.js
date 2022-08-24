import React from 'react';

import { Icon } from '../components/pure';
import {
  MaterialCommunityIcons,
  Ionicons,
  AntDesign
} from '../assets/icons';

const mainScreens = {};

mainScreens.Home = {
  title: 'Accueil',
  icon: ({ focused, color, size }) => {
    const IconFamily = focused ? Ionicons : Ionicons;
    const iconName = focused ? 'home' : 'home-outline';
    return <Icon family={IconFamily} name={iconName} size={size} color={color} />;
  },
  linkTo: '/'
}


mainScreens.Spending = {
  title: 'Dépenses',
  icon: ({ focused, color, size }) => {
    const IconFamily = focused ? Ionicons : Ionicons;
    const iconName = focused ? 'receipt' : 'receipt-outline';
    return <Icon family={IconFamily} name={iconName} size={size} color={color} />;
  },
  linkTo: '/spending'
}

mainScreens.Budget = {
  title: 'Budget',
  icon: ({ focused, color, size }) => {
    const IconFamily = focused ? MaterialCommunityIcons : MaterialCommunityIcons;
    const iconName = focused ? 'piggy-bank' : 'piggy-bank-outline';
    return <Icon family={IconFamily} name={iconName} size={size} color={color} />;
  },
  linkTo: '/budget'
}

mainScreens.Simulation = {
  title: 'Simulation',
  icon: ({ focused, color, size }) => {
    const IconFamily = focused ? Ionicons : Ionicons;
    const iconName = focused ? 'bar-chart' : 'bar-chart-outline';
    return <Icon family={IconFamily} name={iconName} size={size} color={color} />;
  },
  linkTo: '/simulation'
}

mainScreens.Learn = {
  title: 'A propos',
  icon: ({ focused, color, size }) => {
    const IconFamily = focused ? AntDesign : AntDesign;
    const iconName = focused ? 'questioncircle' : 'questioncircleo';
    return <Icon family={IconFamily} name={iconName} size={size} color={color} />;
  },
  linkTo: '/learn'
}

export { mainScreens };