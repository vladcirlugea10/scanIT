import { View, Text, Image, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '@/types/StackParamsList'
import { useTheme } from '../ColorThemeContext';
import useUser from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useTextTranslation from '@/hooks/useTextTranslation';

type BarcodeResultsProps = { route: RouteProp<RootStackParamList, 'BarcodeResults'> };

const BarcodeResults: React.FC<BarcodeResultsProps> = ({route}) => {
  const { product } = route.params;
  const { colors } = useTheme();
  const { token } = useAuth();
  const { addProduct } = useUser(token);
  const { t } = useTranslation();
  const { translateText } = useTextTranslation();
  const energykcal = product.nutriments["energy-kcal"];
  const energykcal100g = product.nutriments["energy-kcal_100g"];
  const energykcalunit = product.nutriments["energy-kcal_unit"];

  const [translatedText, setTranslatedText] = useState("");
  const [translatedTitle, setTranslatedTitle] = useState("");

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
    const newProduct: ScannedProduct = {
      barcode: product._id,
      name: product.product_name,
      brand: product.brands,
      image: product.image_url,
      nutriscore: product.nutriscore_grade,
    }
    addProduct(newProduct);
  }, []);

  useEffect(() => {
    const getLangAndTranslate = async () => {
      try{
        const targetLanguage = await SecureStore.getItemAsync('selectedLanguage');
        const target = targetLanguage?.split('-')[0];
        console.log("Target language: ", target);
        const [translatedText, translatedTitle] = await Promise.all([
          translateText(product.ingredients_text, target),
          translateText(product.product_name, target),
        ]);
  
        setTranslatedText(translatedText || "");
        setTranslatedTitle(translatedTitle || "");
      }catch(error){
        console.error("Error translating text: ", error);
      }
    }
    getLangAndTranslate();
  }, []);

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.mainContainer}>
        <Text style={styles.title}>{translatedTitle || product.product_name} - {product.brands}</Text>
        <View style={styles.imagesContainer}>
          <Image style={styles.image} source={{uri: product.image_url}} />
          {product.selected_images && product.selected_images.front && <Image source={{uri: product.selected_images.front.display.ro}} style={styles.image} />}
          {product.selected_images && product.selected_images.ingredients && <Image source={{uri: product.selected_images.ingredients.display.ro}} style={styles.image} />}
          {product.selected_images && product.selected_images.nutrition && <Image source={{uri: product.selected_images.nutrition.display.ro}} style={styles.image} />}
        </View>
        <Text style={styles.subtitle}>{t('soldIn')}</Text>
        <Text style={styles.text}>{product.countries}</Text>
        <Text style={styles.subtitle}>{t('ingredients')}</Text>
        <Text style={styles.text}>{translatedText || product.ingredients_text}</Text>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image source={{ uri: getNutriscoreImage(product.nutriscore_grade)}} style={{width: 200, height: 100}} />
        </View>
        <Text style={styles.subtitle}>Product has {product.additives_n} additives: </Text>
        { product.additives_tags && product.additives_tags.map((additive, index) => {
            return <Text style={styles.text} key={index}>{additive}</Text>
          })
        }
        <Text style={styles.subtitle}>{t('nutritionalValues')}</Text>

        <View style={styles.tableHeader}>
          <View style={[styles.tableRow, {borderBottomWidth: 5, borderBottomColor: colors.primary}]}>
            <Text style={styles.headerText}>Nutrient</Text>
            <Text style={styles.headerText}>{t('unity')}</Text>
            <Text style={styles.headerText}>{t('for100g')}</Text>
            <Text style={styles.headerText}>{t('forPortion')}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.rowText}>{t('energy')}</Text>
            <Text style={styles.rowText}>{energykcalunit}</Text>
            <Text style={styles.rowText}>{energykcal100g}</Text>
            <Text style={styles.rowText}>{energykcal}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.rowText}>{t('fats')}</Text>
            <Text style={styles.rowText}>{product.nutriments.fat_unit}</Text>
            <Text style={styles.rowText}>{product.nutriments.fat_100g}</Text>
            <Text style={styles.rowText}>{product.nutriments.fat}</Text>
            { product.nutriments.fat > 50 && <MaterialCommunityIcons name='alert-circle-outline' size={24} color={colors.danger} />}
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.rowText}>{t('saturatedFats')}</Text>
            <Text style={styles.rowText}>{product.nutriments.saturated_fat_unit}</Text>
            <Text style={styles.rowText}>{product.nutriments.saturated_fat_100g}</Text>
            <Text style={styles.rowText}>{product.nutriments.saturated_fat}</Text>
            { product.nutriments.saturated_fat > 20 && <MaterialCommunityIcons name='alert-circle-outline' size={24} color={colors.danger} />}
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.rowText}>{t('carbohydrates')}</Text>
            <Text style={styles.rowText}>{product.nutriments.carbohydrates_unit}</Text>
            <Text style={styles.rowText}>{product.nutriments.carbohydrates_100g}</Text>
            <Text style={styles.rowText}>{product.nutriments.carbohydrates}</Text>
            { product.nutriments.carbohydrates > 250 && <MaterialCommunityIcons name='alert-circle-outline' size={24} color={colors.danger} />}
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.rowText}>{t('sugars')}</Text>
            <Text style={styles.rowText}>{product.nutriments.sugars_unit}</Text>
            <Text style={styles.rowText}>{product.nutriments.sugars_100g}</Text>
            <View style={{flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
              <Text style={styles.rowText}>{product.nutriments.sugars}</Text>
              { product.nutriments.sugars > 50 && <MaterialCommunityIcons name='alert-circle-outline' size={24} color={colors.danger} />}
            </View>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.rowText}>{t('proteins')}</Text>
            <Text style={styles.rowText}>{product.nutriments.proteins_unit}</Text>
            <Text style={styles.rowText}>{product.nutriments.proteins_100g}</Text>
            <Text style={styles.rowText}>{product.nutriments.proteins}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.rowText}>{t('salt')}</Text>
            <Text style={styles.rowText}>{product.nutriments.salt_unit}</Text>
            <Text style={styles.rowText}>{product.nutriments.salt_100g}</Text>
            <Text style={styles.rowText}>{product.nutriments.salt}</Text>
            { product.nutriments.salt > 3 && <MaterialCommunityIcons name='alert-circle-outline' size={24} color={colors.danger} />}
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.rowText}>{t('sodium')}</Text>
            <Text style={styles.rowText}>{product.nutriments.sodium_unit}</Text>
            <Text style={styles.rowText}>{product.nutriments.sodium_100g}</Text>
            <Text style={styles.rowText}>{product.nutriments.sodium}</Text>
            { product.nutriments.sodium > 3 && <MaterialCommunityIcons name='alert-circle-outline' size={24} color={colors.danger} />}
          </View>
        </View>
      </View>
    </ScrollView>
  )
};

export default BarcodeResults