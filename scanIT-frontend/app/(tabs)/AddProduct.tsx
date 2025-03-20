import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../ColorThemeContext'
import MyButton from '@/components/MyButton';
import useOpenFoodFacts from '@/hooks/useOpenFoodFacts';
import ShakingErrorText from '@/components/ShakingErrorText';
import { useTranslation } from 'react-i18next';
import useUser from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';

const AddProduct = () => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { getProduct, notFound, loading, error, addProduct } = useOpenFoodFacts();
    const { token } = useAuth();
    const { addNewProduct } = useUser(token);

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

    const styles = StyleSheet.create({
      mainContainer: {
        flex: 1,
        backgroundColor: colors.secondary,
        padding: 10,
      },
      dataContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        padding: 5
      },
      inputContainer: {
        width: "90%",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      },
      horizontalInputContainer:{
        display: "flex",
        flexDirection: "row", 
        gap: 20, 
        width: "50%"
      },
      input: {
        borderWidth: 1,
        width: "100%",
      },
      subtitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.third,
      }
    });

    useEffect(() => {
      console.log(newProduct);
    }, [newProduct]);

    const handleAddProduct = async () => {
      console.log(newProduct);
      const response = await addProduct(newProduct);
      if(response?.status === 1){
        await addNewProduct(newProduct.barcode);
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

    if(checkedBarcode){
      return (
        <View style={styles.mainContainer}>
          <ScrollView>
            <View style={styles.dataContainer}>
              <View style={styles.horizontalInputContainer}>
                <View style={styles.inputContainer}>
                  <Text>{t("productName")}</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, product_name: text}))} placeholder={t("productName")} />
                </View>
                <View style={styles.inputContainer}>
                  <Text>Brand</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, brands: text}))} placeholder="Brand" />
                </View>
              </View>
              <View style={styles.inputContainer}>
                  <Text>{t("categories")}</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, categories: text}))} placeholder={`${t("categories")} - ${t("separateWith")} ,`} />
              </View>
              <Text style={styles.subtitle}>{t("soldIn")}:</Text>
              <View style={styles.horizontalInputContainer}>
                <View style={styles.inputContainer}>
                  <Text>{t("countries")}</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, countries: text}))} placeholder={`${t("countries")} - ${t("separateWith")} ,`} />
                </View>
                <View style={styles.inputContainer}>
                  <Text>{t("stores")}</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, stores: text}))} placeholder={`${t("stores")} - ${t("separateWith")} ,`} />
                </View>
              </View>
              <Text style={styles.subtitle}>{t("ingredients")}</Text>
              <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, ingredients_text: text}))} placeholder={`${t("ingredients")} - ${t("separateWith")} ,`} />
              <Text style={styles.subtitle}>{t("nutrimentsInfo")}:</Text>
              <View style={styles.horizontalInputContainer}>
                <View style={styles.inputContainer}>
                  <Text>{t("carbohydrates")}(g)</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, carbohydrates: parseFloat(text)}))} placeholder={t("carbohydrates")} />
                </View>
                <View style={styles.inputContainer}>
                  <Text>{t("carbohydrates")}/100g</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, carbohydrates_100g: parseFloat(text)}))} placeholder={t("carbohydrates")} />
                </View>
              </View>
              <View style={styles.horizontalInputContainer}>
                <View style={styles.inputContainer}>
                  <Text>{t("energy")}(kJ)</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, energy: parseFloat(text)}))} placeholder={t("energy")} />
                </View>
                <View style={styles.inputContainer}>
                  <Text>{t("energy")}/100g</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, energy_100g: parseFloat(text)}))} placeholder={t("energy")} />
                </View>
              </View>
              <View style={styles.horizontalInputContainer}>
                <View style={styles.inputContainer}>
                  <Text>{t("energy")}(kcal)</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, energy_kcal: parseFloat(text)}))} placeholder={t("energy")} />
                </View>
                <View style={styles.inputContainer}>
                  <Text>{t("energy")}/100g</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, energy_kcal_100g: parseFloat(text)}))} placeholder={t("energy")} />
                </View>
              </View>
              <View style={styles.horizontalInputContainer}>
                <View style={styles.inputContainer}>
                  <Text>{t("fats")}(g)</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, fat: parseFloat(text)}))} placeholder={t("fats")} />
                </View>
                <View style={styles.inputContainer}>
                  <Text>{t("fats")}/100g</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, fat_100g: parseFloat(text)}))} placeholder={t("fats")} />
                </View>
              </View>
              <View style={styles.horizontalInputContainer}>
                <View style={styles.inputContainer}>
                  <Text>{t("proteins")}(g)</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, proteins: parseFloat(text)}))} placeholder={t("proteins")} />
                </View>
                <View style={styles.inputContainer}>
                  <Text>{t("proteins")}/100g</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, proteins_100g: parseFloat(text)}))} placeholder={t("proteins")} />
                </View>
              </View>
              <View style={styles.horizontalInputContainer}>
                <View style={styles.inputContainer}>
                  <Text>{t("salt")}(g)</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, salt: parseFloat(text)}))} placeholder={t("salt")} />
                </View>
                <View style={styles.inputContainer}>
                  <Text>{t("salt")}/100g</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, salt_100g: parseFloat(text)}))} placeholder={t("salt")} />
                </View>
              </View>
              <View style={styles.horizontalInputContainer}>
                <View style={styles.inputContainer}>
                  <Text>{t("saturatedFats")}(g)</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, saturated_fat: parseFloat(text)}))} placeholder={t("saturatedFats")} />
                </View>
                <View style={styles.inputContainer}>
                  <Text>{t("saturatedFats")}/100g</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, saturated_fat_100g: parseFloat(text)}))} placeholder={t("saturatedFats")} />
                </View>
              </View>
              <View style={styles.horizontalInputContainer}>
                <View style={styles.inputContainer}>
                  <Text>{t("sodium")}(g)</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, sodium: parseFloat(text)}))} placeholder={t("sodium")} />
                </View>
                <View style={styles.inputContainer}>
                  <Text>{t("sodium")}/100g</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, sodium_100g: parseFloat(text)}))} placeholder={t("sodium")} />
                </View>
              </View>
              <View style={styles.horizontalInputContainer}>
                <View style={styles.inputContainer}>
                  <Text>{t("sugars")}(g)</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, sugars: parseFloat(text)}))} placeholder={t("sugars")} />
                </View>
                <View style={styles.inputContainer}>
                  <Text>{t("sugars")}/100g</Text>
                  <TextInput style={styles.input} onChangeText={(text) => setNewProduct((prev) => ({...prev, sugars_100g: parseFloat(text)}))} placeholder={t("sugars")} />
                </View>
              </View>
              { error ? <ShakingErrorText text={error} /> : null }
              <MyButton title={t("submitProduct")} onPress={handleAddProduct} containerStyle={{width: "auto"}} />
            </View>
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={styles.mainContainer}>
        <View style={styles.inputContainer}>
          <Text>{t("enterBarcode")}: </Text>
          <TextInput style={styles.input} onChangeText={(text) => setBarcode(text)} keyboardType='numeric' placeholder={t("barcode")} />
        </View>
        { productState === "Product already exists" || productState === "Barcode is empty" ? <ShakingErrorText text={productState} /> : null }
        <MyButton title={t("submitBarcode")} onPress={handleCheckBarcode} containerStyle={{width: "auto"}} />
      </View>
    )
}

export default AddProduct