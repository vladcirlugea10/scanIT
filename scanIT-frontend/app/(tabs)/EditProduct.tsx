import { View, Text, ScrollView, TextInput, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '@/types/StackParamsList'
import { useTheme } from '../ColorThemeContext';
import { useTranslation } from 'react-i18next';
import { createGlobalStyles } from '@/assets/styles';
import MyButton from '@/components/MyButton';
import ShakingErrorText from '@/components/ShakingErrorText';
import useOpenFoodFacts from '@/hooks/useOpenFoodFacts';
import useUser from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { toastSuccess } from '@/components/ToastSuccess';
import { toastError } from '@/components/ToastError';

type EditProductProps = { route: RouteProp<RootStackParamList, "EditProduct"> };

const EditProduct: React.FC<EditProductProps> = ({route}) => {
    const { barcode, product } = route.params;
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { error, editProduct, addImage, loading } = useOpenFoodFacts();
    const { token } = useAuth();
    const { addEditedProduct } = useUser(token);

    const globalStyles = createGlobalStyles(colors);

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [imageFront, setImageFront] = useState<string | undefined>(undefined);
    const [imageIngredients, setImageIngredients] = useState<string | undefined>(undefined);
    const [imageNutrition, setImageNutrition] = useState<string | undefined>(undefined);
    const [editedProduct, setEditedProduct] = useState<EditProduct>({
        barcode: barcode,
        product_name:  "",
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

    const handleEditProduct = async () => {
        let productToEdit = { ...editedProduct };
        
        if(productToEdit.product_name == product?.product_name || productToEdit.product_name == product?.product_name_en ){
            productToEdit.product_name = "";
        }
        if(productToEdit.ingredients_text == product?.ingredients_text){
            productToEdit.ingredients_text = "";
        }
        
        console.log('productToEdit:', productToEdit);
        
        const { barcode, ...productWithoutBarcode } = productToEdit;
        const hasProductChanges = Object.values(productWithoutBarcode).some(value => 
            value !== "" && value !== 0
        );
    
        const hasImages = imageFront || imageIngredients || imageNutrition;
        
        if (!hasProductChanges && !hasImages) {
            console.log('No changes to save, returning early');
            toastError("No changes to save");
            return;
        }
        
        let productEditSuccess = true;
        let response = { status: 1 };
        
        if (hasProductChanges) {
            response = await editProduct(productToEdit);
            console.log("response:", response);
            productEditSuccess = response.status === 1;
            
            if (productEditSuccess) {
                console.log('About to call addEditedProduct with barcode:', productToEdit.barcode);
                try {
                    await addEditedProduct(productToEdit.barcode);
                    console.log('addEditedProduct completed successfully');
                } catch (error) {
                    console.error('Error in addEditedProduct:', error);
                }
            }
            console.log('Product edit section completed');
        } else {
            console.log('No product changes, skipping product edit');
        }
        
        let imageUploadSuccess = true;
        
        if (imageFront) {
            console.log('Attempting to upload front image...');
            try {
                const result = await addImage(imageFront, productToEdit.barcode, 'front');
                console.log("Front image upload result:", result);
            } catch (error) {
                console.error("Failed to upload front image:", error);
                imageUploadSuccess = false;
            }
        } else {
            console.log('No front image to upload');
        }
        
        if (imageIngredients) {
            console.log('Attempting to upload ingredients image...');
            try {
                const result = await addImage(imageIngredients, productToEdit.barcode, 'ingredients');
                console.log("Ingredients image upload result:", result);
            } catch (error) {
                console.error("Failed to upload ingredients image:", error);
                imageUploadSuccess = false;
            }
        } else {
            console.log('No ingredients image to upload');
        }
        
        if (imageNutrition) {
            console.log('Attempting to upload nutrition image...');
            console.log('Calling addImage with:', {
                image: imageNutrition,
                barcode: productToEdit.barcode,
                imagefield: 'nutrition'
            });
            try {
                const result = await addImage(imageNutrition, productToEdit.barcode, 'nutrition');
                console.log("Nutrition image upload result:", result);
            } catch (error) {
                console.error("Failed to upload nutrition image:", error);
                imageUploadSuccess = false;
            }
        } else {
            console.log('No nutrition image to upload');
        }
        
        if (!error && (productEditSuccess || !hasProductChanges) && imageUploadSuccess) {
            toastSuccess(t("productEdited"));
            setTimeout(() => {
                navigation.navigate("Profile");
            }, 2500);
        } else {
            toastError(t("errorEditingProduct"));
        }
    }

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

    return (
        <View style={globalStyles.addProductmainContainer}>
            <ScrollView>
                <View style={globalStyles.addProductDataContainer}>
                    <View style={globalStyles.addProductInputContainer}>
                        <Text style={globalStyles.simpleText}>{t("productName")}</Text>
                        <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} editable={true} defaultValue={product?.product_name || product?.product_name_en} onChangeText={(text) => setEditedProduct((prev) => ({...prev, product_name: text}))} placeholder={ product?.product_name ? "" : t("productName")} />
                    </View>
                    <View style={globalStyles.addProductInputContainer}>
                        <Text style={globalStyles.simpleText}>Brands - {product?.brands || t("none")}</Text>
                        <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, brands: text}))} placeholder={`Brands - ${t("separateWith")} ,`} />
                    </View>
                    <View style={globalStyles.addProductInputContainer}>
                        <Text style={globalStyles.simpleText}>{t("categories") || t("none")} - {product?.categories}</Text>
                        <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, categories: text}))} placeholder={`${t("categories")} - ${t("separateWith")} ,`} />
                    </View>
                    <Text style={globalStyles.subtitle}>{t("soldIn")}:</Text>
                    <View style={globalStyles.horizontalInputContainer}>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text style={globalStyles.simpleText}>{t("countries")} - {product?.countries || t("none")}</Text>
                            <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, countries: text}))} placeholder={`${t("countries")} - ${t("separateWith")} ,`} />
                        </View>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text style={globalStyles.simpleText}>{t("stores")} - {product?.stores || t("none")}</Text>
                            <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, stores: text}))} placeholder={`${t("stores")} - ${t("separateWith")} ,`} />
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
                    <TextInput multiline={true} style={globalStyles.input} placeholderTextColor={colors.primary} defaultValue={product?.ingredients_text} onChangeText={(text) => setEditedProduct((prev) => ({...prev, ingredients_text: text}))} placeholder={`${t("ingredients")} - ${t("separateWith")} ,`} />
                    <Text style={globalStyles.subtitle}>{t("nutrimentsInfo")}:</Text>
                    <View style={globalStyles.horizontalInputContainer}>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text style={globalStyles.simpleText}>{t("carbohydrates")} - {product?.nutriments.carbohydrates}(g)</Text>
                            <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, carbohydrates: parseFloat(text)}))} placeholder={t("carbohydrates")} />
                        </View>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text style={globalStyles.simpleText}>{t("carbohydrates")} - {product?.nutriments.carbohydrates_100g}/100g</Text>
                            <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, carbohydrates_100g: parseFloat(text)}))} placeholder={t("carbohydrates")} />
                        </View>
                    </View>
                    <View style={globalStyles.horizontalInputContainer}>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text style={globalStyles.simpleText}>{t("energy")} - {product?.nutriments.energy}(kJ)</Text>
                            <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, energy: parseFloat(text)}))} placeholder={t("energy")} />
                        </View>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text style={globalStyles.simpleText}>{t("energy")} - {product?.nutriments.energy_100g}/100g</Text>
                            <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, energy_100g: parseFloat(text)}))} placeholder={t("energy")} />
                        </View>
                    </View>
                    <View style={globalStyles.horizontalInputContainer}>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text style={globalStyles.simpleText}>{t("energy")} - {product?.nutriments['energy-kcal']}(kcal)</Text>
                            <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, energy_kcal: parseFloat(text)}))} placeholder={t("energy")} />
                        </View>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text style={globalStyles.simpleText}>{t("energy")} - {product?.nutriments['energy-kcal_100g']}/100g</Text>
                            <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, energy_kcal_100g: parseFloat(text)}))} placeholder={t("energy")} />
                        </View>
                    </View>
                    <View style={globalStyles.horizontalInputContainer}>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text style={globalStyles.simpleText}>{t("fats")} - {product?.nutriments.fat}(g)</Text>
                            <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, fat: parseFloat(text)}))} placeholder={t("fats")} />
                        </View>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text style={globalStyles.simpleText}>{t("fats")} - {product?.nutriments.fat_100g}/100g</Text>
                            <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, fat_100g: parseFloat(text)}))} placeholder={t("fats")} />
                        </View>
                    </View>
                    <View style={globalStyles.horizontalInputContainer}>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text style={globalStyles.simpleText}>{t("proteins")} - {product?.nutriments.proteins}(g)</Text>
                            <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, proteins: parseFloat(text)}))} placeholder={t("proteins")} />
                        </View>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text style={globalStyles.simpleText}>{t("proteins")} - {product?.nutriments.proteins_100g}/100g</Text>
                            <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, proteins_100g: parseFloat(text)}))} placeholder={t("proteins")} />
                        </View>
                    </View>
                    <View style={globalStyles.horizontalInputContainer}>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text style={globalStyles.simpleText}>{t("salt")} - {product?.nutriments.salt}(g)</Text>
                            <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, salt: parseFloat(text)}))} placeholder={t("salt")} />
                        </View>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text style={globalStyles.simpleText}>{t("salt")} - {product?.nutriments.salt_100g}/100g</Text>
                            <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, salt_100g: parseFloat(text)}))} placeholder={t("salt")} />
                        </View>
                    </View>
                    <View style={globalStyles.horizontalInputContainer}>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text style={globalStyles.simpleText}>{t("saturatedFats")} - {product?.nutriments.saturated_fat}(g)</Text>
                            <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, saturated_fat: parseFloat(text)}))} placeholder={t("saturatedFats")} />
                        </View>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text style={globalStyles.simpleText}>{t("saturatedFats")} - {product?.nutriments.saturated_fat_100g}/100g</Text>
                            <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, saturated_fat_100g: parseFloat(text)}))} placeholder={t("saturatedFats")} />
                        </View>
                    </View>
                    <View style={globalStyles.horizontalInputContainer}>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text style={globalStyles.simpleText}>{t("sodium")} - {product?.nutriments.sodium}(g)</Text>
                            <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, sodium: parseFloat(text)}))} placeholder={t("sodium")} />
                        </View>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text style={globalStyles.simpleText}>{t("sodium")} - {product?.nutriments.sodium_100g}/100g</Text>
                            <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, sodium_100g: parseFloat(text)}))} placeholder={t("sodium")} />
                        </View>
                    </View>
                    <View style={globalStyles.horizontalInputContainer}>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text style={globalStyles.simpleText}>{t("sugars")} - {product?.nutriments.sugars}(g)</Text>
                            <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, sugars: parseFloat(text)}))} placeholder={t("sugars")} />
                        </View>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text style={globalStyles.simpleText}>{t("sugars")} - {product?.nutriments.sugars_100g}/100g</Text>
                            <TextInput style={globalStyles.input} placeholderTextColor={colors.primary} onChangeText={(text) => setEditedProduct((prev) => ({...prev, sugars_100g: parseFloat(text)}))} placeholder={t("sugars")} />
                        </View>
                    </View>
                    { error ? <ShakingErrorText text={error} /> : null }
                    { loading ? <ActivityIndicator size="large" color={colors.primary} /> : null }
                    <MyButton title={t("submitProduct")} onPress={handleEditProduct} containerStyle={{width: "auto"}} />
                </View>
            </ScrollView>
        </View>
    )
}

export default EditProduct