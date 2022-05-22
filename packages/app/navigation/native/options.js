import mainScreens from '../main-screens';

export const tabBarOptions = (route) => ({
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