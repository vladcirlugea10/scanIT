import { View, Image, StyleSheet } from 'react-native'
import React from 'react'
import MyButton from '@/components/MyButton';
import useImageOCR from '@/hooks/useImageOCR';
import { RouteProp } from '@react-navigation/native';

type ImageEditProps = { route: RouteProp<RootStackParamList, 'ImageEdit'> };

const ImageEdit: React.FC<ImageEditProps> = ({route} ) => {
  const {photoUri} = route.params;
  const {loading, scanImage} = useImageOCR();

  const handleScanImage = () => {
    scanImage({uri: photoUri});
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.imageContainer}>
        <Image source={{uri: photoUri}} style={styles.image} />
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
  },
})

export default ImageEdit