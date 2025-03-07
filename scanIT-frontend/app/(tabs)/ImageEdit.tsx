import { View, Image, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import MyButton from '@/components/MyButton';
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native';
import * as ImageManipulator from 'expo-image-manipulator';
import ImageCropper from '@/components/ImageCropper';
import { RootStackParamList } from '@/types/StackParamsList';
import { useTheme } from '../ColorThemeContext';
import { useTranslation } from 'react-i18next';

type ImageEditProps = { route: RouteProp<RootStackParamList, 'ImageEdit'> };

const ImageEdit: React.FC<ImageEditProps> = ({route}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {photoUri} = route.params;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [isCropping, setIsCropping] = useState(true);
  const [croppedImage, setCroppedImage] = useState("");
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      backgroundColor: colors.secondary
    },
    imageContainer:{
      width: '85%',
      height: '80%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContainer: {
      width: '100%',
      height: '10%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 50,
      overflow: 'hidden',
      resizeMode: 'contain',
    },
  })

  const handleCropImage = async (cropArea: {originX: number, originY: number, width: number, height: number} ) => {
    const editedResult = await ImageManipulator.manipulateAsync(photoUri, [{crop: cropArea}], {compress: 1, format: ImageManipulator.SaveFormat.JPEG});
    setCroppedImage(editedResult.uri);
    setIsCropping(false);
  }

  const handleScanImage = async () => {
    if(croppedImage || photoUri){
      navigation.navigate('ScanImage', {photoUri: croppedImage || photoUri});
    }
  };

  if(isCropping){
    return <ImageCropper imageUri={photoUri} onCropComplete={handleCropImage} />
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.imageContainer}>
        <Image source={{uri: croppedImage || photoUri}} style={styles.image} />                           
      </View>
      <View style={styles.buttonContainer}>
        <MyButton title={t('scanImage')} onPress={handleScanImage} containerStyle={{width: "auto"}} />
      </View>
    </View>
  )
}

export default ImageEdit