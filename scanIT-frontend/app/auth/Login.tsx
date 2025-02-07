import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Login = () => {
  return (
    <View style={styles.mainContainer}>
      <Text>Login</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default Login