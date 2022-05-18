import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Home } from '../../screens/Home'
import { UserDetail } from '../../screens/UserDetail'

const Stack = createNativeStackNavigator()

export function NativeNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        // headerTitle: props => <MyHeaderApp {...props} />
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={({ route }) => ({ title: route.name })}
      />
      <Stack.Screen
        name="UserDetail"
        component={UserDetail}
        options={{
          title: 'User',
        }}
      />
    </Stack.Navigator>
  )
}
