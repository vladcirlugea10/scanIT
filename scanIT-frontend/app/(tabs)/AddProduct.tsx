import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../ColorThemeContext'
import MyButton from '@/components/MyButton';
import useOpenFoodFacts from '@/hooks/useOpenFoodFacts';
import ShakingErrorText from '@/components/ShakingErrorText';
import { useTranslation } from 'react-i18next';
import useUser from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types/StackParamsList';
import { createGlobalStyles } from '@/assets/styles';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { toastSuccess } from '@/components/ToastSuccess';
import { toastError } from '@/components/ToastError';

const AddProduct = () => {
    const { colors } = useTheme();
    const globalStyles = createGlobalStyles(colors);
    const { t } = useTranslation();
    const { getProduct, notFound, loading, error, addProduct, product, addImage } = useOpenFoodFacts();
    const { token } = useAuth();
    const { addNewProduct } = useUser(token);

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [cameraActive, setCameraActive] = useState(false);
    const [imageFront, setImageFront] = useState<string | undefined>(undefined);
    const [imageIngredients, setImageIngredients] = useState<string | undefined>(undefined);
    const [imageNutrition, setImageNutrition] = useState<string | undefined>(undefined);
    const [barcode, setBarcode] = useState("");
    const [productState, setProductState] = useState("");
    const [checkedBarcode, setCheckedBarcode] = useState(false);
    const [newProduct, setNewProduct] = useState<AddProduct>({
      barcode: "",
      product_name: "",
      brands: "",
      categories: "",
      countries: "",
      stores: "",
      ingredients_text: "",
      carbohydrates: 0,
      carbohydrates_100g: 0,
      energy: 0,
      energy_100g: 0,
      "energy-kcal": 0,
      "energy-kcal_100g": 0,
      fat: 0,
      fat_100g: 0,
      proteins: 0,
      proteins_100g: 0,
      salt: 0,
      salt_100g: 0,
      saturated_fat: 0,
      saturated_fat_100g: 0,
      sodium: 0,
      sodium_100g: 0,
      sugars: 0,
      sugars_100g: 0
    });

    const handleAddProduct = async () => {
      console.log(newProduct);
      const response = await addProduct(newProduct);
      if(response?.status === 1){
        console.log("Product added successfully");
        await addNewProduct(newProduct.barcode);
      }

      if (imageFront) {
        await addImage(imageFront, newProduct.barcode, 'front');
        console.log("Image front added successfully");
      }
      if (imageIngredients) {
        await addImage(imageIngredients, newProduct.barcode, 'ingredients');
        console.log("Image ingredients added successfully");
      }
      if (imageNutrition) {
        await addImage(imageNutrition, newProduct.barcode, 'nutrition');
        console.log("Image nutrition added successfully");
      }
      if(!error && response?.status === 1){
        toastSuccess(t("productAdded"));
        setTimeout(() => {
          navigation.navigate("Profile");
        }, 2500);
      }else{
        toastError(t("productNotAdded"));
      }
    }

    const handleCheckBarcode = async () => {
      console.log(barcode);
      if(!barcode){
        setProductState("Barcode is empty");
        return;
      }

      setProductState("Checking...");
      await getProduct(barcode);
    };     

    useEffect(() => {
      if (barcode) {
        if (loading) {
          setProductState("Checking...");
        } else if (notFound) {
          setProductState("Product does not exist");
          setNewProduct((prev) => ({...prev, barcode: barcode}));
          setCheckedBarcode(true);
        } else {
          setProductState("Product already exists");
        }
      }
    }, [notFound, loading]);

    const pickImage = async (type: string) => {
      console.log("Uploading image of type: ", type);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled && result.assets.length > 0) {
        switch(type){
          case "front":
            setImageFront(result.assets[0].uri);
            break;
          case "ingredients":
            setImageIngredients(result.assets[0].uri);
            break;
          case "nutrition":
            setImageNutrition(result.assets[0].uri);
            break;
          default:
            break;
        }
      }
    };

    const handleTakePicture = async (type: string) => {
      console.log("Taking picture of: ", type);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });
      if(!result.canceled && result.assets.length > 0) {
        switch(type){
          case "front":
            setImageFront(result.assets[0].uri);
            break;
          case "ingredients":
            setImageIngredients(result.assets[0].uri);
            break;
          case "nutrition":
            setImageNutrition(result.assets[0].uri);
            break;
          default:
            break;
        }
      }
    };

    if(checkedBarcode){
      return (
        <View style={globalStyles.addProductmainContainer}>
          <ScrollView>
            <View style={globalStyles.addProductDataContainer}>
              <View style={globalStyles.horizontalInputContainer}>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("productName")}</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, product_name: text}))} placeholder={t("productName")} />
                </View>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>Brand</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, brands: text}))} placeholder="Brand" />
                </View>
              </View>
              <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("categories")}</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, categories: text}))} placeholder={`${t("categories")} - ${t("separateWith")} ,`} />
              </View>
              <Text style={globalStyles.subtitle}>{t("soldIn")}:</Text>
              <View style={globalStyles.horizontalInputContainer}>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("countries")}</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, countries: text}))} placeholder={`${t("countries")} - ${t("separateWith")} ,`} />
                </View>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("stores")}</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, stores: text}))} placeholder={`${t("stores")} - ${t("separateWith")} ,`} />
                </View>
              </View>
              <View style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                <Text style={globalStyles.subtitle}>{t('frontPackageImage')}</Text>
                <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
                  <Image source={{ uri: imageFront }} style={{ width: 100, height: 100, borderWidth: 1, borderColor: colors.primary}} />
                  <View style={{display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'baseline'}}>
                    <View style={[globalStyles.rowContainer, {gap: 10}]}> 
                      <TouchableOpacity>
                        <MaterialCommunityIcons name="camera" size={24} color={colors.primary} onPress={() => handleTakePicture("front")} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => pickImage("front")}>
                        <MaterialCommunityIcons name="plus" size={24} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => setImageFront(undefined)}>
                      <MaterialCommunityIcons name="trash-can" size={24} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={globalStyles.subtitle}>{t('ingredientPackageImage')}</Text>
                <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
                  <Image source={{ uri: imageIngredients }} style={{ width: 100, height: 100, borderWidth: 1, borderColor: colors.primary}} />
                  <View style={{display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'baseline'}}>
                    <View style={[globalStyles.rowContainer, {gap: 10}]}> 
                      <TouchableOpacity>
                        <MaterialCommunityIcons name="camera" size={24} color={colors.primary} onPress={() => handleTakePicture("ingredients")} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => pickImage("ingredients")}>
                        <MaterialCommunityIcons name="plus" size={24} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => setImageIngredients(undefined)}>
                      <MaterialCommunityIcons name="trash-can" size={24} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={globalStyles.subtitle}>{t('nutritionPackageImage')}</Text>
                <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
                  <Image source={{ uri: imageNutrition }} style={{ width: 100, height: 100, borderWidth: 1, borderColor: colors.primary}} />
                  <View style={{display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'baseline'}}>
                    <View style={[globalStyles.rowContainer, {gap: 10}]}> 
                      <TouchableOpacity>
                        <MaterialCommunityIcons name="camera" size={24} color={colors.primary} onPress={() => handleTakePicture("nutrition")} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => pickImage("nutrition")}>
                        <MaterialCommunityIcons name="plus" size={24} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => setImageNutrition(undefined)}>
                      <MaterialCommunityIcons name="trash-can" size={24} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <Text style={globalStyles.subtitle}>{t("ingredients")}</Text>
              <TextInput multiline={true} style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, ingredients_text: text}))} placeholder={`${t("ingredients")} - ${t("separateWith")} ,`} />
              <Text style={globalStyles.subtitle}>{t("nutrimentsInfo")}:</Text>
              <View style={globalStyles.horizontalInputContainer}>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("carbohydrates")}(g)</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, carbohydrates: parseFloat(text)}))} placeholder={t("carbohydrates")} />
                </View>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("carbohydrates")}/100g</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, carbohydrates_100g: parseFloat(text)}))} placeholder={t("carbohydrates")} />
                </View>
              </View>
              <View style={globalStyles.horizontalInputContainer}>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("energy")}(kJ)</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, energy: parseFloat(text)}))} placeholder={t("energy")} />
                </View>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("energy")}/100g</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, energy_100g: parseFloat(text)}))} placeholder={t("energy")} />
                </View>
              </View>
              <View style={globalStyles.horizontalInputContainer}>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("energy")}(kcal)</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, energy_kcal: parseFloat(text)}))} placeholder={t("energy")} />
                </View>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("energy")}/100g</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, energy_kcal_100g: parseFloat(text)}))} placeholder={t("energy")} />
                </View>
              </View>
              <View style={globalStyles.horizontalInputContainer}>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("fats")}(g)</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, fat: parseFloat(text)}))} placeholder={t("fats")} />
                </View>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("fats")}/100g</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, fat_100g: parseFloat(text)}))} placeholder={t("fats")} />
                </View>
              </View>
              <View style={globalStyles.horizontalInputContainer}>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("proteins")}(g)</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, proteins: parseFloat(text)}))} placeholder={t("proteins")} />
                </View>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("proteins")}/100g</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, proteins_100g: parseFloat(text)}))} placeholder={t("proteins")} />
                </View>
              </View>
              <View style={globalStyles.horizontalInputContainer}>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("salt")}(g)</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, salt: parseFloat(text)}))} placeholder={t("salt")} />
                </View>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("salt")}/100g</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, salt_100g: parseFloat(text)}))} placeholder={t("salt")} />
                </View>
              </View>
              <View style={globalStyles.horizontalInputContainer}>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("saturatedFats")}(g)</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, saturated_fat: parseFloat(text)}))} placeholder={t("saturatedFats")} />
                </View>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("saturatedFats")}/100g</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, saturated_fat_100g: parseFloat(text)}))} placeholder={t("saturatedFats")} />
                </View>
              </View>
              <View style={globalStyles.horizontalInputContainer}>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("sodium")}(g)</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, sodium: parseFloat(text)}))} placeholder={t("sodium")} />
                </View>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("sodium")}/100g</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, sodium_100g: parseFloat(text)}))} placeholder={t("sodium")} />
                </View>
              </View>
              <View style={globalStyles.horizontalInputContainer}>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("sugars")}(g)</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, sugars: parseFloat(text)}))} placeholder={t("sugars")} />
                </View>
                <View style={globalStyles.addProductInputContainer}>
                  <Text style={globalStyles.simpleText}>{t("sugars")}/100g</Text>
                  <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setNewProduct((prev) => ({...prev, sugars_100g: parseFloat(text)}))} placeholder={t("sugars")} />
                </View>
              </View>
              { error ? <ShakingErrorText text={error} /> : null }
              { loading ? <ActivityIndicator testID="loading-indicator" size="large" color={colors.primary} /> : null }
              <MyButton title={t("submitProduct")} onPress={handleAddProduct} containerStyle={{width: "auto"}} />
            </View>
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={[globalStyles.addProductmainContainer, {alignItems: "center", paddingTop: 100}]}>
        <View style={globalStyles.addProductInputContainer}>
          <Text style={globalStyles.simpleText}>{t("enterBarcode")}: </Text>
          <TextInput style={[globalStyles.input, {borderColor: colors.primary}]} placeholderTextColor={colors.primary} onChangeText={(text) => setBarcode(text)} keyboardType='numeric' placeholder={t("barcode")} />
        </View>
        { productState === "Barcode is empty" ? <ShakingErrorText text={productState} /> : null }
        { productState === "Product already exists" ? 
          <>
            <ShakingErrorText text={productState} />
            { loading ? <ActivityIndicator testID="loading-indicator" size="large" color={colors.primary} /> : null }
            <TouchableOpacity onPress={() => navigation.navigate("EditProduct", { barcode: barcode, product: product })}>
                <Text style={globalStyles.textForPressing}>{t("editProduct")}</Text>
            </TouchableOpacity>
          </> : 
          null 
        }
        {loading ? <ActivityIndicator testID="loading-indicator" size="large" color={colors.primary} /> : null }
        <MyButton title={t("submitBarcode")} onPress={handleCheckBarcode} containerStyle={{width: "auto", marginTop: 20}} />
      </View>
    )
}

export default AddProduct