import { View, Text, Image, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '@/types/StackParamsList'
import { useTheme } from '../ColorThemeContext';
import useUser from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';

type BarcodeResultsProps = { route: RouteProp<RootStackParamList, 'BarcodeResults'> };

const BarcodeResults: React.FC<BarcodeResultsProps> = ({route}) => {
  const { product } = route.params;
  const { colors } = useTheme();
  const { token } = useAuth();
  const { addProduct } = useUser(token);
  const energykcal = product.nutriments["energy-kcal"];
  const energykcal100g = product.nutriments["energy-kcal_100g"];
  const energykcalunit = product.nutriments["energy-kcal_unit"];

  const styles = StyleSheet.create({
    mainContainer: {
      width: '100%',
      height: '100%',
      display: "flex",
      flexDirection: "column",
      gap: 10,
      backgroundColor: colors.secondary,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    scrollContainer: {
      flexGrow: 1,
      backgroundColor: colors.secondary,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    text: {
      fontSize: 16,
    },
    imagesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 10,
      paddingTop: 10,
      borderTopWidth: 5,
      borderTopColor: colors.primary,
    },
    image: {
      width: "30%",
      height: 100,
      marginBottom: 10,
    },
    tableHeader: {
      marginTop: 10,
      gap: 5,
    },
    headerText: {
      flex: 1,
      textAlign: 'center',
      fontWeight: 'bold'
    },
    tableRow: {
      flex: 1, 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      borderBottomWidth: 2,
    },
    rowText: {
      flex: 1,
      textAlign: 'center',
    }
  });

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

  useEffect(() => {
    console.log("aici:",product);
    const newProduct: ScannedProduct = {
      barcode: product._id,
      name: product.product_name,
      brand: product.brands,
      image: product.image_url,
      nutriscore: product.nutriscore_grade,
    }
    addProduct(newProduct);
  }, []);

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.mainContainer}>
        <Text style={styles.title}>{product.product_name} - {product.brands}</Text>
        <View style={styles.imagesContainer}>
          <Image style={styles.image} source={{uri: product.image_url}} />
          {product.selected_images && product.selected_images.front && <Image source={{uri: product.selected_images.front.display.ro}} style={styles.image} />}
          {product.selected_images && product.selected_images.ingredients && <Image source={{uri: product.selected_images.ingredients.display.ro}} style={styles.image} />}
          {product.selected_images && product.selected_images.nutrition && <Image source={{uri: product.selected_images.nutrition.display.ro}} style={styles.image} />}
        </View>
        <Text style={styles.subtitle}>Vândut în: </Text>
        <Text style={styles.text}>{product.countries}</Text>
        <Text style={styles.subtitle}>Ingrediente: </Text>
        <Text style={styles.text}>{product.ingredients_text}</Text>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image source={{ uri: getNutriscoreImage(product.nutriscore_grade)}} style={{width: 200, height: 100}} />
        </View>
        <Text style={styles.subtitle}>Valori Nutriționale: </Text>

        <View style={styles.tableHeader}>
          <View style={[styles.tableRow, {borderBottomWidth: 5, borderBottomColor: colors.primary}]}>
            <Text style={styles.headerText}>Nutrient</Text>
            <Text style={styles.headerText}>Unitate</Text>
            <Text style={styles.headerText}>Per 100g</Text>
            <Text style={styles.headerText}>Per porție</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.rowText}>Energie</Text>
            <Text style={styles.rowText}>{energykcalunit}</Text>
            <Text style={styles.rowText}>{energykcal100g}</Text>
            <Text style={styles.rowText}>{energykcal}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.rowText}>Grasimi</Text>
            <Text style={styles.rowText}>{product.nutriments.fat_unit}</Text>
            <Text style={styles.rowText}>{product.nutriments.fat_100g}</Text>
            <Text style={styles.rowText}>{product.nutriments.fat}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.rowText}>Grasimi saturate</Text>
            <Text style={styles.rowText}>{product.nutriments.saturated_fat_unit}</Text>
            <Text style={styles.rowText}>{product.nutriments.saturated_fat_100g}</Text>
            <Text style={styles.rowText}>{product.nutriments.saturated_fat}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.rowText}>Carbohidrati</Text>
            <Text style={styles.rowText}>{product.nutriments.carbohydrates_unit}</Text>
            <Text style={styles.rowText}>{product.nutriments.carbohydrates_100g}</Text>
            <Text style={styles.rowText}>{product.nutriments.carbohydrates}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.rowText}>Zaharuri</Text>
            <Text style={styles.rowText}>{product.nutriments.sugars_unit}</Text>
            <Text style={styles.rowText}>{product.nutriments.sugars_100g}</Text>
            <Text style={styles.rowText}>{product.nutriments.sugars}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.rowText}>Proteine</Text>
            <Text style={styles.rowText}>{product.nutriments.proteins_unit}</Text>
            <Text style={styles.rowText}>{product.nutriments.proteins_100g}</Text>
            <Text style={styles.rowText}>{product.nutriments.proteins}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.rowText}>Sare</Text>
            <Text style={styles.rowText}>{product.nutriments.salt_unit}</Text>
            <Text style={styles.rowText}>{product.nutriments.salt_100g}</Text>
            <Text style={styles.rowText}>{product.nutriments.salt}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.rowText}>Sodiu</Text>
            <Text style={styles.rowText}>{product.nutriments.sodium_unit}</Text>
            <Text style={styles.rowText}>{product.nutriments.sodium_100g}</Text>
            <Text style={styles.rowText}>{product.nutriments.sodium}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
};

export default BarcodeResults