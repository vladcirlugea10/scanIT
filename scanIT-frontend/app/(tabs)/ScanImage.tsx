import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native'
import MyButton from '@/components/MyButton';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '@/types/StackParamsList';
import useImageOCR from '@/hooks/useImageOCR';
import { useTheme } from '../ColorThemeContext';
import { useTranslation } from 'react-i18next';

type ScanImageNavProps = { route: RouteProp<RootStackParamList, 'ScanImage'> };

const ScanImage: React.FC<ScanImageNavProps> = ({route}) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { photoUri } = route.params;
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { scanImage, loading, data } = useImageOCR();

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
        handleScan();
    }, [photoUri]);

    const handleScan = async() => {
        if(photoUri){
            await scanImage ({uri: photoUri});
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
            <MyButton title={t('checkIngredients')} onPress={handleCheckIngredients} containerStyle={{width: "45%"}} />
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