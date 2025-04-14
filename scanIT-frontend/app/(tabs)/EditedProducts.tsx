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

const EditedProducts = () => {
    const { token, user, isAuth } = useAuth();
    const { getUserData } = useUser(token);
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { product, getProduct, notFound } = useOpenFoodFacts();

    const [modalVisible, setModalVisible] = useState(false);

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

    return (
        <View style={styles.mainContainer}>
            <Text style={globalStyles.subtitle}>{t('yourAddedProducts')}: </Text>
            <View style={styles.productContainer}>
                {user?.addedProductsBarcodes && user.addedProductsBarcodes.length > 0 ? 
                (
                    user.addedProductsBarcodes.map((product, index) => (
                    <View key={index} style={styles.infoContainerRow}>
                        <Text style={styles.text}>{product}</Text>
                    </View>
                    ))
                ) : 
                (
                    <Text style={styles.text}>{t("noProductsAdded")}</Text>
                )
                }
                <TouchableOpacity>
                    <Text style={globalStyles.textForPressing} onPress={handleModal} >{t("editExistingProduct")}</Text>
                </TouchableOpacity>
            </View>
            <BarcodeModal visible={modalVisible} onClose={handleModal} onPressSubmit={checkBarcode} /> 
        </View>
    );
}

export default EditedProducts