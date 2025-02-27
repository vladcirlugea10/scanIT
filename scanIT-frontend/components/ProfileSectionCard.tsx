import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '@/app/ColorThemeContext'
import { Ionicons } from '@expo/vector-icons';

interface ProfileSectionCardProps{
    onPress?: () => void;
    title: string;
    iconName?: string;
    iconSize?: number;
    textColor?: string;
    containerStyle?: object;
    textStyle?: object;
}

const ProfileSectionCard = ({onPress, title, iconName, iconSize, textColor, containerStyle, textStyle} : ProfileSectionCardProps) => {
    const { colors } = useTheme();
    const styles = StyleSheet.create({
        mainContainer:{
            width: 'auto',
            backgroundColor: colors.third,
            padding: 10,
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
            borderRadius: 15,
        },
        title:{
            fontWeight: 'bold',
            fontSize: 20,
            color: textColor,
            borderBottomWidth: 1,
            borderBottomColor: colors.primary,
        },
    });

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.mainContainer, containerStyle]}>
                { iconName && <Ionicons name={iconName} size={iconSize} color={textColor} /> }
                <Text style={[styles.title, textStyle]}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ProfileSectionCard