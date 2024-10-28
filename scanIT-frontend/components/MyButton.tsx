import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

interface MyButtonProps {
    onPress: () => void;
    title?: string;
    textStyle?: object;
    containerStyle?: object;
    iconName?: string | undefined;
    iconSize?: number;
    iconColor?: string;
}

const MyButton = ({
    onPress,
    title,
    textStyle = {},
    containerStyle = {},
    iconName,
    iconSize = 24,
    iconColor = "darkgrey"
}:MyButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, containerStyle]}>
        <Text style={[styles.buttonText, textStyle]}>
            {title}
        </Text>
        {iconName ? <Ionicons name={iconName} size={iconSize} color={iconColor} /> : null}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    buttonText:{
        color: "darkgrey",
        fontSize: 20,
    },
    container:{
        backgroundColor: 'lightblue',
        padding: 10,
        borderRadius: 50,
        width: 100,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default MyButton