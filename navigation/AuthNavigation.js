import { createStackNavigator } from 'react-navigation-stack'
import Login from '../screens/Login'
import Signup from '../screens/Signup'
import AuthLoadingScreen from '../screens/AuthLoadingScreen'

const AuthNavigation = createStackNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    //AuthLoading: { screen: AuthLoadingScreen },
    Login: { screen: Login },
    Signup: { screen: Signup }
  },
  {
    initialRouteName: 'AuthLoading',
    headerMode: 'none'
  }
)

export default AuthNavigation

//export default AuthNavigation
