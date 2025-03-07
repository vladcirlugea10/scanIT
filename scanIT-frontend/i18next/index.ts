import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';
import * as Localization from 'expo-localization';
import translationEN from './locales/en-US/translation.json';
import translationRO from './locales/ro-RO/translation.json';

const resources = {
    "en-US": { translation: translationEN },
    "ro-RO": { translation: translationRO },
};

const initI18next = async () => {
    let selectedLanguage = await SecureStore.getItemAsync('selectedLanguage');
    if(!selectedLanguage){
        if(Localization.getLocales()[0].languageCode === 'ro'){
            selectedLanguage = 'ro-RO';
        }else{
            selectedLanguage = 'en-US';
        }
    }
    console.log("locale:", Localization.getLocales()[0].languageCode);
    console.log("Selected language: ", selectedLanguage);
    i18n.use(initReactI18next).init({
        compatibilityJSON: 'v3',
        resources,
        lng: selectedLanguage,
        fallbackLng: 'en-US',
        interpolation: {
            escapeValue: false
        },   
    });
};

initI18next();

export default i18n;