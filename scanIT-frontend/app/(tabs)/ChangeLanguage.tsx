import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../ColorThemeContext';
import * as SecureStore from 'expo-secure-store';

const ChangeLanguage = () => {
    const { t, i18n } = useTranslation();
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        mainContainer:{
            flex: 1,
            padding: 20,
            gap: 20,
            backgroundColor: colors.secondary,
            alignItems: 'center',
        },
        languagesContainer:{
            width: '100%',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 10,
        },
        text:{
            color: colors.primary,
            fontSize: 20,
            fontWeight: 'bold',
        },
        image:{
            width: 80,
            height: 60,
            margin: 5,
        }
    });

    const handleLanguageChange = async (language: string) => {
        await SecureStore.setItemAsync('selectedLanguage', language);
        i18n.changeLanguage(language);
        console.log("Language changed to: ", language);
    }

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.text} >{t("availableLanguages")}: </Text>
            <View style={styles.languagesContainer}>
                <TouchableOpacity onPress={() => handleLanguageChange('en-UK')}>
                    <Image style={styles.image} source={require('../../assets/images/uk_flag.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleLanguageChange('ro-RO')}>
                    <Image style={styles.image} source={require('../../assets/images/romania_flag.png')} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ChangeLanguage