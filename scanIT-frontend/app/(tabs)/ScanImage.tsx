import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native'
import MyButton from '@/components/MyButton';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '@/types/StackParamsList';
import useImageOCR from '@/hooks/useImageOCR';
import { useTheme } from '../ColorThemeContext';
import { useTranslation } from 'react-i18next';
import NetInfo from '@react-native-community/netinfo';

type ScanImageNavProps = { route: RouteProp<RootStackParamList, 'ScanImage'> };

const ScanImage: React.FC<ScanImageNavProps> = ({route}) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { photoUri } = route.params;
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { scanImage, scanImageOffline, loading, data } = useImageOCR();
    console.log(data);

    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [scanMethod, setScanMethod] = useState<string | null>(null);

    const styles = StyleSheet.create({
      mainContainer: {
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          backgroundColor: colors.secondary,
        },
        resultContainer:{
          width: '85%',
          height: '50%',
          padding: 16,
          borderTopWidth: 2,
          borderTopColor: 'black',
        },
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

    const handleCheckIngredients = () => {
        navigation.navigate('IngredientsCheck', {data: data});
    }

    if(loading){
        return(
          <View style={styles.mainContainer}>
            <ActivityIndicator size='large' color={colors.primary} />
            <Text>{t('scanningImage')}...</Text>
          </View>
        )
    }

    if(data.text.length > 0){
        return(
          <View style={styles.mainContainer}>
            <Text style={{fontSize: 25, fontWeight: 700}}>
              {t('productIngredientList')}:
            </Text>
            <View style={styles.resultContainer}>
              <Text style={{fontSize: 16}}>{data.text.join(" ")}</Text>
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