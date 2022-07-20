import { mainScreens } from '../main-screens';

export const tabBarOptions = (route) => {  
  return {
    tabBarIcon: mainScreens[route.name.substring(0, route.name.length - 5)].icon,
    tabBarActiveTintColor: 'tomato',
    tabBarInactiveTintColor: 'gray',
  }
}

export const headerOptions = (route) => {
  return {
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerTitle: mainScreens[route.name].title,
  }
}