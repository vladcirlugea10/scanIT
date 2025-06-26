import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/app/ColorThemeContext';

interface MyButtonProps {
    onPress: () => void;
    title?: string;
    textStyle?: object;
    containerStyle?: object;
    iconName?: string | undefined;
    iconSize?: number;
    iconColor?: string;
    testID?: string;
}

const MyButton = ({
    onPress,
    title,
    textStyle = {},
    containerStyle = {},
    iconName,
    iconSize = 24,
    iconColor,
    testID
}:MyButtonProps) => {
    const { colors } = useTheme();
    const finalIconColor = iconColor || colors.secondary;
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
    });
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, containerStyle]} testID={testID}>
        <Text style={[styles.buttonText, textStyle]}>
            {title}
        </Text>
        {iconName ? <Ionicons name={iconName} size={iconSize} color={finalIconColor} /> : null}
    </TouchableOpacity>
  )
}

export default MyButton