import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native'
import MyButton from '@/components/MyButton';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '@/types/StackParamsList';
import useImageOCR from '@/hooks/useImageOCR';
import { useTheme } from '../ColorThemeContext';
import { useTranslation } from 'react-i18next';
import NetInfo from '@react-native-community/netinfo';
import SelectBox from '@/components/SelectBox';
import { countryCodes } from '@/assets/data/countries';
import { createGlobalStyles } from '@/assets/styles';
import useTextTranslation from '@/hooks/useTextTranslation';
import { toastSuccess } from '@/components/ToastSuccess';

type ScanImageNavProps = { route: RouteProp<RootStackParamList, 'ScanImage'> };

const ScanImage: React.FC<ScanImageNavProps> = ({route}) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { photoUri } = route.params;
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { scanImage, scanImageOffline, loading, data } = useImageOCR();
    const { translateText, loading: translationLoading } = useTextTranslation();
    const globalStyles = createGlobalStyles(colors);
    console.log(data);

    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [scanMethod, setScanMethod] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    console.log("Photo URI:", photoUri);
    console.log("Is connected:", isConnected);

    const styles = StyleSheet.create({
      mainContainer: {
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          backgroundColor: colors.secondary,
          paddingBottom: 20
        },
        resultContainer:{
          width: '85%',
          height: '50%',
          padding: 16,
          borderTopWidth: 2,
          borderTopColor: colors.third,
        },
        translationContainer:{
          width: '85%',
          height: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }
  })

    useEffect(() => {
      const checkConnection = async () => {
        const netInfo = await NetInfo.fetch();
        setIsConnected(netInfo.isConnected || false);
        console.log("Connection status:", isConnected);
      };

      checkConnection();

      const unsubscribe = NetInfo.addEventListener(state => {
        setIsConnected(state.isConnected);
      });

      return () => {
        unsubscribe();
      };
    }, []);

    useEffect(() => {
        if(isConnected !== null){
          handleScan();
        }
    }, [photoUri, isConnected]);

    const handleScan = async() => {
        if(!photoUri) return;

        try{
            if(isConnected){
              setScanMethod('online');
              await scanImage({uri: photoUri});
            } else {
              setScanMethod('offline');
              await scanImageOffline({uri: photoUri});
            }
        }catch(error){
            console.error("Error during scan:", error);
            if(isConnected && scanMethod === 'online'){
              setScanMethod('offline (fallback)');
              await scanImageOffline({uri: photoUri});
            }
        }
    }

    const handleSelectedLanguage = (language: string) => {
      setSelectedLanguage(language);
      handleTranslation(language);
    }

    const handleTranslation = async (language: string) => {
        const lang = language || selectedLanguage;
        const translatedText = await translateText(data.text.join(" "), lang);
        setTranslatedText(translatedText);
        toastSuccess(t('translationSuccess'));
    }

    const handleCheckIngredients = () => {
        navigation.navigate('IngredientsCheck', {data: data});
    }

    if(loading){
        return(
          <View style={styles.mainContainer}>
            <ActivityIndicator testID="loading-indicator" size='large' color={colors.primary} />
            <Text>{t('scanningImage')}...</Text>
          </View>
        )
    }

    if(data.text.length > 0){
        return(
          <View style={styles.mainContainer}>
            <View style={styles.translationContainer}>
              <Text style={[globalStyles.textForPressing, {color: colors.primary}]}>{t('translateTo')}</Text>
              <Ionicons name='arrow-forward' size={20} color={colors.primary} />
              <SelectBox title={t("language")} options={countryCodes} selectedOption={selectedLanguage} setSelectedOption={handleSelectedLanguage} />
            </View>
            <Text style={globalStyles.title}>
              {t('productIngredientList')}:
            </Text>
            <View style={styles.resultContainer}>
              {translationLoading ? (
                  <ActivityIndicator testID="loading-indicator" size='large' color={colors.primary} />
                ) : (
                  <Text style={globalStyles.simpleText}>{translatedText || data.text.join(" ")}</Text>
                )
              }
            </View>
            <MyButton title={t('checkIngredients')} onPress={handleCheckIngredients} containerStyle={{width: "auto"}} />
          </View>
        )
    }

    if(data.text.length === 0 || !data.text){
        return(
          <View style={styles.mainContainer}>
            <Ionicons name='alert-circle-outline' size={50} color={colors.warning} />
            <Text>{t('somethingWentWrong')}! {t('pleaseTryAgain')}!</Text>
          </View>
        )
    }
}

export default ScanImage