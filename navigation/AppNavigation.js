import { createStackNavigator } from 'react-navigation-stack'
import Home from '../screens/Home'
import Dashboard from '../screens/Dashboard'
import AddKhata from '../screens/AddKhata'

const AppNavigation = createStackNavigator(
  {
    Home: { screen: Home },
    Dashboard: { screen: Dashboard },
    AddKhata: { screen: AddKhata }
  },
  {
    initialRouteName: 'Home'
  }
)

export default AppNavigation
