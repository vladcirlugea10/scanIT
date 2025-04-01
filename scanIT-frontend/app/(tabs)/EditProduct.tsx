import { View, Text, ScrollView, TextInput } from 'react-native'
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

type EditProductProps = { route: RouteProp<RootStackParamList, "EditProduct"> };

const EditProduct: React.FC<EditProductProps> = ({route}) => {
    const { barcode, product } = route.params;
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { error, editProduct } = useOpenFoodFacts();
    const { token } = useAuth();
    const { addEditedProduct } = useUser(token);

    const globalStyles = createGlobalStyles(colors);

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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
        if(editedProduct.product_name == product?.product_name || editedProduct.product_name == product?.product_name_en ){
            console.log("product",product?.product_name_en);
            console.log("edited",editedProduct.product_name);
            setEditedProduct((prev) => ({...prev, product_name: ""}));
        }
        if(editedProduct.ingredients_text == product?.ingredients_text){
            setEditedProduct((prev) => ({...prev, ingredients_text: ""}));
        }
        console.log(editedProduct);
        const response = await editProduct(editedProduct);
        console.log("response:", response);
        if(response.status === 1){
            await addEditedProduct(editedProduct.barcode);
        }
    }

    return (
        <View style={globalStyles.addProductmainContainer}>
            <ScrollView>
                <View style={globalStyles.addProductDataContainer}>
                    <View style={globalStyles.addProductInputContainer}>
                        <Text>{t("productName")}</Text>
                        <TextInput style={globalStyles.input} editable={true} defaultValue={product?.product_name || product?.product_name_en} onChangeText={(text) => setEditedProduct((prev) => ({...prev, product_name: text}))} placeholder={ product?.product_name ? "" : t("productName")} />
                    </View>
                    <View style={globalStyles.addProductInputContainer}>
                        <Text>Brands - {product?.brands || t("none")}</Text>
                        <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, brands: text}))} placeholder={`Brands - ${t("separateWith")} ,`} />
                    </View>
                    <View style={globalStyles.addProductInputContainer}>
                        <Text>{t("categories") || t("none")} - {product?.categories}</Text>
                        <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, categories: text}))} placeholder={`${t("categories")} - ${t("separateWith")} ,`} />
                    </View>
                    <Text style={globalStyles.subtitle}>{t("soldIn")}:</Text>
                    <View style={globalStyles.horizontalInputContainer}>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text>{t("countries")} - {product?.countries || t("none")}</Text>
                            <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, countries: text}))} placeholder={`${t("countries")} - ${t("separateWith")} ,`} />
                        </View>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text>{t("stores")} - {product?.stores || t("none")}</Text>
                            <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, stores: text}))} placeholder={`${t("stores")} - ${t("separateWith")} ,`} />
                        </View>
                    </View>
                    <Text style={globalStyles.subtitle}>{t("ingredients")}</Text>
                    <TextInput style={globalStyles.input} defaultValue={product?.ingredients_text} onChangeText={(text) => setEditedProduct((prev) => ({...prev, ingredients_text: text}))} placeholder={`${t("ingredients")} - ${t("separateWith")} ,`} />
                    <Text style={globalStyles.subtitle}>{t("nutrimentsInfo")}:</Text>
                    <View style={globalStyles.horizontalInputContainer}>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text>{t("carbohydrates")} - {product?.nutriments.carbohydrates}(g)</Text>
                            <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, carbohydrates: parseFloat(text)}))} placeholder={t("carbohydrates")} />
                        </View>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text>{t("carbohydrates")} - {product?.nutriments.carbohydrates_100g}/100g</Text>
                            <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, carbohydrates_100g: parseFloat(text)}))} placeholder={t("carbohydrates")} />
                        </View>
                    </View>
                    <View style={globalStyles.horizontalInputContainer}>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text>{t("energy")} - {product?.nutriments.energy}(kJ)</Text>
                            <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, energy: parseFloat(text)}))} placeholder={t("energy")} />
                        </View>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text>{t("energy")} - {product?.nutriments.energy_100g}/100g</Text>
                            <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, energy_100g: parseFloat(text)}))} placeholder={t("energy")} />
                        </View>
                    </View>
                    <View style={globalStyles.horizontalInputContainer}>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text>{t("energy")} - {product?.nutriments['energy-kcal']}(kcal)</Text>
                            <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, energy_kcal: parseFloat(text)}))} placeholder={t("energy")} />
                        </View>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text>{t("energy")} - {product?.nutriments['energy-kcal_100g']}/100g</Text>
                            <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, energy_kcal_100g: parseFloat(text)}))} placeholder={t("energy")} />
                        </View>
                    </View>
                    <View style={globalStyles.horizontalInputContainer}>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text>{t("fats")} - {product?.nutriments.fat}(g)</Text>
                            <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, fat: parseFloat(text)}))} placeholder={t("fats")} />
                        </View>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text>{t("fats")} - {product?.nutriments.fat_100g}/100g</Text>
                            <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, fat_100g: parseFloat(text)}))} placeholder={t("fats")} />
                        </View>
                    </View>
                    <View style={globalStyles.horizontalInputContainer}>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text>{t("proteins")} - {product?.nutriments.proteins}(g)</Text>
                            <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, proteins: parseFloat(text)}))} placeholder={t("proteins")} />
                        </View>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text>{t("proteins")} - {product?.nutriments.proteins_100g}/100g</Text>
                            <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, proteins_100g: parseFloat(text)}))} placeholder={t("proteins")} />
                        </View>
                    </View>
                    <View style={globalStyles.horizontalInputContainer}>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text>{t("salt")} - {product?.nutriments.salt}(g)</Text>
                            <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, salt: parseFloat(text)}))} placeholder={t("salt")} />
                        </View>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text>{t("salt")} - {product?.nutriments.salt_100g}/100g</Text>
                            <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, salt_100g: parseFloat(text)}))} placeholder={t("salt")} />
                        </View>
                    </View>
                    <View style={globalStyles.horizontalInputContainer}>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text>{t("saturatedFats")} - {product?.nutriments.saturated_fat}(g)</Text>
                            <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, saturated_fat: parseFloat(text)}))} placeholder={t("saturatedFats")} />
                        </View>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text>{t("saturatedFats")} - {product?.nutriments.saturated_fat_100g}/100g</Text>
                            <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, saturated_fat_100g: parseFloat(text)}))} placeholder={t("saturatedFats")} />
                        </View>
                    </View>
                    <View style={globalStyles.horizontalInputContainer}>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text>{t("sodium")} - {product?.nutriments.sodium}(g)</Text>
                            <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, sodium: parseFloat(text)}))} placeholder={t("sodium")} />
                        </View>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text>{t("sodium")} - {product?.nutriments.sodium_100g}/100g</Text>
                            <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, sodium_100g: parseFloat(text)}))} placeholder={t("sodium")} />
                        </View>
                    </View>
                    <View style={globalStyles.horizontalInputContainer}>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text>{t("sugars")} - {product?.nutriments.sugars}(g)</Text>
                            <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, sugars: parseFloat(text)}))} placeholder={t("sugars")} />
                        </View>
                        <View style={globalStyles.addProductInputContainer}>
                            <Text>{t("sugars")} - {product?.nutriments.sugars_100g}/100g</Text>
                            <TextInput style={globalStyles.input} onChangeText={(text) => setEditedProduct((prev) => ({...prev, sugars_100g: parseFloat(text)}))} placeholder={t("sugars")} />
                        </View>
                    </View>
                    { error ? <ShakingErrorText text={error} /> : null }
                    <MyButton title={t("submitProduct")} onPress={handleEditProduct} containerStyle={{width: "auto"}} />
                </View>
            </ScrollView>
        </View>
    )
}

export default EditProduct