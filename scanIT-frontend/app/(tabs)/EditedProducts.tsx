import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import useUser from '@/hooks/useUser'
import { useAuth } from '@/hooks/useAuth'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '@/types/StackParamsList'
import { createGlobalStyles } from '@/assets/styles'
import { useTheme } from '../ColorThemeContext'
import { useTranslation } from 'react-i18next'
import BarcodeModal from '@/components/BarcodeModal'
import useOpenFoodFacts from '@/hooks/useOpenFoodFacts'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const EditedProducts = () => {
    const { token, user, isAuth } = useAuth();
    const { getUserData } = useUser(token);
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { product, getProduct, notFound, loading } = useOpenFoodFacts();

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBarcode, setSelectedBarcode] = useState<string | null>(null);

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const globalStyles = createGlobalStyles(colors);
    const styles = StyleSheet.create({
        mainContainer: {
            flex: 1,
            backgroundColor: colors.secondary,
            display: 'flex',
            flexDirection: 'column',
            padding: '5%',
        },
        productContainer:{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
        },
        infoContainerRow:{
            height: 'auto',
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center'
        },
        text:{
            fontSize: 20,
            color: colors.third,
        },
    })

    useEffect(() => {
        if(!isAuth){
            navigation.navigate('Auth');
        } else{
            getUserData();
        }
    }, [isAuth]);

    const handleModal = () => {
        setModalVisible(!modalVisible);
    }

    const checkBarcode = async (barcode: string) => {
        try {
        await getProduct(barcode);
        if (notFound) {
            Alert.alert(
            t('error'),
            t('productNotFound'),
            [{ text: 'OK', style: 'cancel' }]
            );
        } else if (product) {
            navigation.navigate("EditProduct", { barcode: barcode, product: product });
        }
        } catch (error) {
        console.log('Error getting product: ', error);
        Alert.alert(
            t('error'),
            t('errorFetchingProduct'),
            [{ text: 'OK', style: 'cancel' }]
        );
        }
    };

    useEffect(() => {
        if (product && selectedBarcode) {
            navigation.navigate('BarcodeResults', { product: product });
            setSelectedBarcode(null);
        }
    }, [product]);

    useEffect(() => {
        if (notFound && selectedBarcode) {
            alert(t('product not found'));
            setSelectedBarcode(null);
        }
    }, [notFound]);

    const handleDetailsPress = (barcode: string) => {
        setSelectedBarcode(barcode);
        getProduct(barcode);
    };

    return (
        <View style={styles.mainContainer}>
            <Text style={[globalStyles.subtitle, {color: colors.primary}]}>{t('yourEditedProducts')}: </Text>
            <View style={styles.productContainer}>
                {user?.editedProductsBarcodes && user.editedProductsBarcodes.length > 0 ? 
                (
                    user.editedProductsBarcodes.map((product, index) => (
                    <View key={index} style={styles.infoContainerRow}>
                        <Text style={styles.text}>{product}</Text>
                        <TouchableOpacity onPress={() => handleDetailsPress(product)} style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                            <Text style={globalStyles.textForPressing}>{t("details")}</Text>
                            <MaterialCommunityIcons name="plus-box" size={24} color={colors.third} />
                        </TouchableOpacity>
                    </View>
                    ))
                ) : 
                (
                    <Text style={styles.text}>{t("noProductsEdited")}</Text>
                )
                }
                <TouchableOpacity>
                    <Text style={[globalStyles.textForPressing, {color: colors.primary}]} onPress={handleModal} >{t("editExistingProduct")}</Text>
                </TouchableOpacity>
            </View>
            <BarcodeModal visible={modalVisible} onClose={handleModal} onPressSubmit={checkBarcode} /> 
        </View>
    );
}

export default EditedProducts