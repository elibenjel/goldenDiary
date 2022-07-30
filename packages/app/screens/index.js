import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Spending as SpendingScreen } from './Spending/Spending';
import { Home as HomeScreen } from './Home/Home';
import { Budget as BudgetScreen } from './Budget/Budget';
import { Learn as LearnScreen } from './Learn/Learn';
import { Simulation as SimulationScreen } from './Simulation/Simulation';

import { TopLayout } from '../components/wrapper';
import { SpendingProvider } from '../provider/api';
import { CameraProvider } from '../provider/camera';

import { headerOptions } from '../navigation/native/options';

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

const withWrapper = (Wrapper, Screen, wrapperProps = {}) => {
  const WrappedScreen = () => {
    return (
      <Wrapper {...wrapperProps}>
        <Screen />
      </Wrapper>
    )
  }

  return WrappedScreen;
}

export const Spending = withWrapper(
  CameraProvider,
  withWrapper(
    SpendingProvider,
    withStackNavigator(
      'Spending',
      withWrapper(TopLayout, SpendingScreen)
    )
  ),
  { saveDir : 'bills' }
);

export const Home = withStackNavigator('Home', withWrapper(TopLayout, HomeScreen));
export const Budget = withStackNavigator('Budget', withWrapper(TopLayout, BudgetScreen));
export const Learn = withStackNavigator('Learn', withWrapper(TopLayout, LearnScreen));
export const Simulation = withStackNavigator('Simulation', withWrapper(TopLayout, SimulationScreen));
