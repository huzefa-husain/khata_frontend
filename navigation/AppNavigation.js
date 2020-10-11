import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Home from '../screens/Home'
import Dashboard from '../screens/Dashboard'
import AddKhata from '../screens/AddKhata'
import AddContact from '../screens/AddContact'
import SelectAmount from '../screens/SelectAmount'
import AddAmount from '../screens/AddAmount'
import GetUserAmount from '../screens/GetUserAmount'

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

const AppNavigation = createStackNavigator({
  Home: {
    screen: createBottomTabNavigator({
      Home: {
        screen: Home,
      },
      Dashboard: {
        screen: Dashboard,
      },
    })
  },
  AddKhata: { screen: AddKhata },
  AddContact: { screen: AddContact },
  SelectAmount: { screen: SelectAmount },
  AddAmount: { screen: AddAmount },
  GetUserAmount: { screen: GetUserAmount }
});



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

export default AppNavigation
