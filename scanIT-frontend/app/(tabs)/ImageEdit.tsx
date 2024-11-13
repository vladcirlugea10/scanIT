import { View, Image, StyleSheet, Text, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import MyButton from '@/components/MyButton';
import useImageOCR from '@/hooks/useImageOCR';
import { RouteProp } from '@react-navigation/native';
import * as ImageManipulator from 'expo-image-manipulator';
import ImageCropper from '@/components/ImageCropper';
import { colors } from '@/assets/colors';

type ImageEditProps = { route: RouteProp<RootStackParamList, 'ImageEdit'> };

const ImageEdit: React.FC<ImageEditProps> = ({route} ) => {
  const {photoUri} = route.params;
  const {loading, scanImage, data} = useImageOCR();
  const [isCropping, setIsCropping] = useState(true);
  const [croppedImage, setCroppedImage] = useState("");

  const handleCropImage = async (cropArea: {originX: number, originY: number, width: number, height: number} ) => {
    console.log("crop area",cropArea);
    const newImageSize = {width: cropArea.width, height: cropArea.height};
    console.log("new image size: ", newImageSize);
    const editedResult = await ImageManipulator.manipulateAsync(photoUri, [{crop: cropArea}], {compress: 1, format: ImageManipulator.SaveFormat.JPEG});
    setCroppedImage(editedResult.uri);
    console.log("edited result: ", editedResult);
    setIsCropping(false);
  }

  const handleScanImage = () => {
    if(croppedImage){
      scanImage({uri: croppedImage});
    } else {
      scanImage({uri: photoUri});
    }
  };

  if(isCropping){
    return <ImageCropper imageUri={photoUri} onCropComplete={handleCropImage} />
  }

  if(loading){
    return(
      <View style={styles.mainContainer}>
        <ActivityIndicator size='large' color={colors.primary} />
      </View>
    )
  }

  if(data.text.length > 0){
    console.log("data", data);
    return(
      <View style={styles.mainContainer}>
        <Text style={{fontSize: 25, fontWeight: 700}}>
          Product ingredients list:
        </Text>
        <View style={styles.resultContainer}>
          <Text style={{fontSize: 16}}>{data.text.join(" ")}</Text>
        </View>
        <MyButton title='Check ingredients' onPress={() => console.log("Checking")} containerStyle={{width: 175}} />
      </View>
    )
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.imageContainer}>
        <Image source={{uri: croppedImage || photoUri}} style={styles.image} />
      </View>
      <View style={styles.buttonContainer}>
        <MyButton title='Scan' onPress={handleScanImage} />
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
  resultContainer:{
    width: '85%',
    height: '75%',
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: 'black',
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