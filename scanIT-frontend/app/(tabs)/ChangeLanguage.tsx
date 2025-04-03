import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../ColorThemeContext';
import * as SecureStore from 'expo-secure-store';
import SelectBox from '@/components/SelectBox';
import countryMap from '@/assets/data/countries';

const ChangeLanguage = () => {
    const { t, i18n } = useTranslation();
    const { colors } = useTheme();

    const [selectedCountry, setSelectedCountry] = useState('');
    const countryOptions = Object.keys(countryMap);

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

    const handleSelectedCountry = async (country: string) => {
        console.log("Selected country: ", country);
        setSelectedCountry(country);
        await SecureStore.setItemAsync('selectedCountry', country);
        console.log("Country code saved: ", country);
    }

    return (
        <View style={styles.mainContainer}>
            <SelectBox title={t("location")} options={countryOptions} selectedOption={selectedCountry} setSelectedOption={handleSelectedCountry} style={{width: '100%'}}/>
            <Text>{t("currentCountrySelected")}: {}</Text>
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