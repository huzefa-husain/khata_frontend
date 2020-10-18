import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Home from '../screens/Home'
import Dashboard from '../screens/Dashboard'
import AddKhata from '../screens/AddKhata'
import AddContact from '../screens/AddContact'
import SelectAmount from '../screens/SelectAmount'
import AddAmount from '../screens/AddAmount'
import GetUserAmount from '../screens/GetUserAmount'
import Profile from '../screens/Profile'

/*const AppNavigation = createStackNavigator(
  {
    Home: { screen: Home },
    Dashboard: { screen: Dashboard },
    AddKhata: { screen: AddKhata },
    AddContact: { screen: AddContact },
    SelectAmount: { screen: SelectAmount },
    AddAmount: { screen: AddAmount },
    GetUserAmount: { screen: GetUserAmount }
  },
  {
    initialRouteName: 'Home'
  }
)*/

/*const AppNavigation = createBottomTabNavigator({
  Home: {
    screen: createStackNavigator({
      Home: {
        screen: Dashboard,
      },
      Dashboard: {
        screen: Dashboard
      },
    }),
    navigationOptions: {
      //header: null,
    },
  },
  AddKhata: { screen: AddKhata },
  AddContact: { screen: AddContact },
  SelectAmount: { screen: SelectAmount },
  AddAmount: { screen: AddAmount },
  GetUserAmount: { screen: GetUserAmount }
});*/

/*AppNavigation.navigationOptions = {
  // Hide the header from AppNavigator stack
  headerTitle: 'working',
  headerMode: 'none'
};*/

/*const AppNavigation = createBottomTabNavigator({
  Home: {
      screen: Home,
  },
  Chat: {
      screen: Dashboard
  },
}, {
  initialRouteName: 'Home',
})*/

const HomeStack = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      header:null,
      headerBackTitle: null,
      headerTitle: null,
    },
  },
  AddKhata: { screen: AddKhata },
  AddContact: { 
    screen: AddContact 
  }
});

const DashboardStack = createStackNavigator({
  Dashboard: {
    screen: Dashboard
  },
  AddKhata: { screen: AddKhata },
  AddContact: { 
    screen: AddContact 
  }
});

const AppNavigation = createBottomTabNavigator({
  Home: {
    screen: HomeStack,
    navigationOptions: {
      tabBarLabel: 'Home',
    },
  },
  Dashboard: {
    screen: DashboardStack,
    navigationOptions: {
      tabBarLabel: 'Dashboard',
    },
  },
  Profile:{
    screen: Profile,
    navigationOptions: {
      tabBarLabel: 'Profile',
    },
  }
});

export default AppNavigation
