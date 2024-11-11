import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'

const PageHeader = ({title}: {title: string}) => {
  return (
    <View style={styles.header}>
        <Image style={styles.headerLogo} source={require('@/assets/images/logo.png')} />
        <Text style={styles.headerText} >{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    header: {
        width: '110%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 10,
        backgroundColor: 'lightblue',
    },
    headerText: {
        color: 'darkgrey',
        fontSize: 30,
    },
    headerLogo: {
        width: 80,
        height: 80,
    }
});

export default PageHeader