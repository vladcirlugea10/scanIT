import { View, Image, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import MyButton from '@/components/MyButton';
import useImageOCR from '@/hooks/useImageOCR';
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native';
import * as ImageManipulator from 'expo-image-manipulator';
import ImageCropper from '@/components/ImageCropper';

type ImageEditProps = { route: RouteProp<RootStackParamList, 'ImageEdit'> };

const ImageEdit: React.FC<ImageEditProps> = ({route}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {photoUri} = route.params;
  const {data} = useImageOCR();
  const [isCropping, setIsCropping] = useState(true);
  const [croppedImage, setCroppedImage] = useState("");

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
        <MyButton title='Scan image' onPress={handleScanImage} containerStyle={{width: 130}} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
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

export default ImageEdit