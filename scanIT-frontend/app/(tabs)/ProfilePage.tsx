import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const ProfilePage = () => {
  return (
    <View style={styles.mainContainer} >
      <Text>ProfilePage</Text>
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

export default ProfilePage