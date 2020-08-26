import React from 'react'
import AppContainer from './navigation'
import { MenuProvider } from 'react-native-popup-menu';

export default function App() {
  return <MenuProvider><AppContainer /></MenuProvider>
}
