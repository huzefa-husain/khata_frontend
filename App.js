import React from 'react'
import { StatusBar } from 'react-native'
import AppContainer from './navigation'
import { MenuProvider } from 'react-native-popup-menu';

export default function App() {
  return <MenuProvider>
      <StatusBar barStyle="dark-content" hidden={false}/>
      <AppContainer />
    </MenuProvider>
}
