import { createStackNavigator } from 'react-navigation-stack'
import Home from '../screens/Home'
import Dashboard from '../screens/Dashboard'
import AddKhata from '../screens/AddKhata'
import AddContact from '../screens/AddContact'
import SelectAmount from '../screens/SelectAmount'
import AddAmount from '../screens/AddAmount'

const AppNavigation = createStackNavigator(
  {
    Home: { screen: Home },
    Dashboard: { screen: Dashboard },
    AddKhata: { screen: AddKhata },
    AddContact: { screen: AddContact },
    SelectAmount: { screen: SelectAmount },
    AddAmount: { screen: AddAmount }
  },
  {
    initialRouteName: 'Home'
  }
)

export default AppNavigation
