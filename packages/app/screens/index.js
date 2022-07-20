// export { HomeStack as Home } from './Home/HomeStack';
// export { BudgetStack as Budget } from './Budget/BudgetStack';
// export { SpendingStack as Spending } from './Spending/SpendingStack';
// export { LearnStack as Learn } from './Learn/LearnStack';
// export { SimulationStack as Simulation } from './Simulation/SimulationStack';

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { headerOptions } from '../navigation/native/options';
import { Spending as SpendingScreen } from './Spending/Spending';
import { Home as HomeScreen } from './Home/Home';
import { Budget as BudgetScreen } from './Budget/Budget';
import { Learn as LearnScreen } from './Learn/Learn';
import { Simulation as SimulationScreen } from './Simulation/Simulation';

const withStackNavigator = (name, Screen) => {
    const Stack = createNativeStackNavigator();
    const WrappedScreen = () => {
        return (
            <Stack.Navigator
              screenOptions={({ route }) => ({ ...headerOptions(route) })}
            >
              <Stack.Screen
                name={name}
                component={Screen}
              />
            </Stack.Navigator>
        )
    }

    return WrappedScreen;
}

export const Spending = withStackNavigator('Spending', SpendingScreen);
export const Home = withStackNavigator('Home', HomeScreen);
export const Budget = withStackNavigator('Budget', BudgetScreen);
export const Learn = withStackNavigator('Learn', LearnScreen);
export const Simulation = withStackNavigator('Simulation', SimulationScreen);
