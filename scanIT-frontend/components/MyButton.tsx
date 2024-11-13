import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/assets/colors';

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
    iconColor = colors.secondary
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
        color: colors.secondary,
        fontSize: 20,
    },
    container:{
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 15,
        width: 100,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default MyButton