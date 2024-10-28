import React from 'react'
import AppNavigator from './AppNavigator'
import { registerRootComponent } from 'expo'

const App = () => {
  return <AppNavigator />
};

export default registerRootComponent(App);