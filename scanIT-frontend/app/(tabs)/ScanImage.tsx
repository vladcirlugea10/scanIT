import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native'
import useImageOCR from '@/hooks/useImageOCR';
import { colors } from '@/assets/colors';
import MyButton from '@/components/MyButton';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '@/types/StackParamsList';

type ScanImageNavProps = { route: RouteProp<RootStackParamList, 'ScanImage'> };

const ScanImage: React.FC<ScanImageNavProps> = ({route}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { photoUri } = route.params;
    const { scanImage, loading, data } = useImageOCR();
    console.log(data);

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
          </View>
        )
    }

    if(data.text.length > 0){
        return(
          <View style={styles.mainContainer}>
            <Text style={{fontSize: 25, fontWeight: 700}}>
              Product ingredients list:
            </Text>
            <View style={styles.resultContainer}>
              <Text style={{fontSize: 16}}>{data.text.join(" ")}</Text>
            </View>
            <MyButton title='Check ingredients' onPress={handleCheckIngredients} containerStyle={{width: 175}} />
          </View>
        )
    }

    if(data.text.length === 0){
        return(
          <View style={styles.mainContainer}>
            <Ionicons name='alert-circle-outline' size={50} color={colors.warning} />
            <Text>Something went wrong! Please try again!</Text>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      },
      resultContainer:{
        width: '85%',
        height: '75%',
        padding: 16,
        borderTopWidth: 2,
        borderTopColor: 'black',
      },
})

export default ScanImage