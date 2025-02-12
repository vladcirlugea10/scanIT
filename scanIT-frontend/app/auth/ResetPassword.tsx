import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const ResetPassword = () => {
  return (
    <View style={styles.mainContainer}>
      <Text>ResetPassword</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ResetPassword