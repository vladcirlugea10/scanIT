import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '@/types/StackParamsList'
import { colors } from '@/assets/colors';

type BarcodeResultsProps = { route: RouteProp<RootStackParamList, 'BarcodeResults'> };

const BarcodeResults: React.FC<BarcodeResultsProps> = ({route}) => {
  const { product } = route.params;
  const energykcal = product.nutriments["energy-kcal"];
  const energykcal100g = product.nutriments["energy-kcal_100g"];
  const energykcalunit = product.nutriments["energy-kcal_unit"];

  const getNutriscoreImage = (nutriscore: string) => {
    let imageURL: string;
    switch(nutriscore){
      case 'a':
        imageURL = 'https://static.openfoodfacts.org/images/misc/nutriscore-a.png';
        break;
      case 'b':
        imageURL = 'https://static.openfoodfacts.org/images/misc/nutriscore-b.png';
        break;
      case 'c':
        imageURL = 'https://static.openfoodfacts.org/images/misc/nutriscore-c.png';
        break;
      case 'd':
        imageURL = 'https://static.openfoodfacts.org/images/misc/nutriscore-d.png';
        break;
      case 'e':
        imageURL = 'https://static.openfoodfacts.org/images/misc/nutriscore-e.png';
        break;
      default: 
        imageURL = ''
    }
    return imageURL;
  }

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>{product.product_name} - {product.brands}</Text>
      <Text>({product.countries}) - {product.ingredients_text}</Text>
      <Image source={{uri: product.image_url}} style={{width: 100, height: 100}} />
      {product.selected_images && product.selected_images.front && <Image source={{uri: product.selected_images.front.display.ro}} style={{width: 100, height: 100}} />}
      {product.selected_images && product.selected_images.ingredients && <Image source={{uri: product.selected_images.ingredients.display.ro}} style={{width: 100, height: 100}} />}
      {product.selected_images && product.selected_images.nutrition && <Image source={{uri: product.selected_images.nutrition.display.ro}} style={{width: 100, height: 100}} />}
      <Text>Nutriscore: {product.nutriscore_grade}</Text>
      <Image source={{ uri: getNutriscoreImage(product.nutriscore_grade)}} style={{width: 200, height: 100}} />
      <Text>Carbohidrati: {product.nutriments.carbohydrates} - {product.nutriments.carbohydrates_100g}/100{product.nutriments.carbohydrates_unit}</Text>
      <Text>Energie: {energykcal} - {energykcal100g}/100{energykcalunit}</Text>
      <Text>Grasimi: {product.nutriments.fat} - {product.nutriments.fat_100g}/100{product.nutriments.fat_unit}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  }
});

export default BarcodeResults