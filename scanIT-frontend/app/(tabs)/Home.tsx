import { View, Text, StyleSheet, Image, ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { CameraCapturedPicture, CameraView, useCameraPermissions, CameraPictureOptions } from 'expo-camera'
import { StatusBar } from 'expo-status-bar'
import MyButton from '@/components/MyButton'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from 'expo-image-picker'
import { RootStackParamList } from '@/types/StackParamsList'
import useOpenFoodFacts from '@/hooks/useOpenFoodFacts'
import { useTheme } from '../ColorThemeContext'
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from '@expo/vector-icons'
import SelectBox from '@/components/SelectBox'
import { countryMap } from '@/assets/data/countries'
import { toastInfo } from '@/components/ToastInfo'
import { createGlobalStyles } from '@/assets/styles'

type HomeNavProps = NativeStackNavigationProp<RootStackParamList, 'Home'>

const Home = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState<CameraCapturedPicture | undefined>(undefined);
    const [selectedMode, setSelectedMode] = useState<'barcode' | 'photo'>('photo');
    const [barcodeData, setBarcodeData] = useState<string | undefined>(undefined);
    const [country, setCountry] = useState('');
    const [isScanning, setIsScanning] = useState(false);

    const cameraRef = useRef<CameraView>(null);
    const { getProduct, product, notFound } = useOpenFoodFacts();
    const { colors } = useTheme();
    const { t } = useTranslation();
    const globalStyles = createGlobalStyles(colors);

    const navigation = useNavigation<HomeNavProps>();

    const styles = StyleSheet.create({
        mainContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.secondary
        },
        dataContainer:{
            gap: 10,
            width: '80%',
            height: '90%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        cameraContainer: {
            width: '100%',
            height: '85%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        camera: {
            width: '100%',
            height: '100%',
            overflow: 'hidden',
        },
        buttonContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start'
        },
        button: {
            width: 'auto',
            height: 30,
            borderRadius: 10,
            padding: 5,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'grey'
        },
        buttonText: {
            fontSize: 12,
            fontWeight: 'light'
        },
        selectedModeButton: {
            backgroundColor: colors.primary,
        },
        scanOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        scanText: {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 20,
        }
    });

    useEffect(() => {
        if(selectedMode === 'barcode'){
            toastInfo(t('scan a product by barcode to get started'));
        }
        if(selectedMode === 'photo'){
            toastInfo(t('take a photo of a product label to scan the text'));
        }
    }, [selectedMode]);

    const showAlert = () =>
    Alert.alert(
        t('product not found'),
        t('aProductWithThisBarcodeCouldntBeFound'),
        [
            {
                text: 'Ok',
                style: 'cancel',
                onPress: () => {
                    setBarcodeData(undefined);
                    setIsScanning(true);
                }
            },
            {
                text: t("addItHere"),
                onPress: () => navigation.navigate("AddProduct"),
            }
        ],
        {
            cancelable: true,
        },
    );

    useFocusEffect(
        React.useCallback(() => {
            setBarcodeData(undefined);
            setPhoto(undefined);
            setIsScanning(true);
            return () => {}
        }, [])
    );

    useEffect(() => {
        if(product){
            navigation.navigate('BarcodeResults', { product: product });
            setBarcodeData(undefined);
        }
    }, [product]);

    useEffect(() => {
        if(notFound){
            showAlert();
            console.log("Product not found!");
        }
    }, [notFound]);

    const takePhoto = async () => {
        if(cameraRef.current){
            try{
                const options: CameraPictureOptions = {quality: 0.5, base64: true, shutterSound: false};
                const photo = await cameraRef.current?.takePictureAsync(options);
                if(photo){
                    const resizedPhoto = await ImageManipulator.manipulateAsync(
                        photo.uri,
                        [{ resize: { width: 1500, height: 2000 } }],
                        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
                    );
                    setPhoto(resizedPhoto);
                }       
            }catch(err){
                console.log(err);
            }
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            aspect: [3, 4],
            quality: 1,
        });

        if (!result.canceled) {
            const resizedPhoto = await ImageManipulator.manipulateAsync(
                result.assets[0].uri,
                [{ resize: { width: 1500, height: 2000 } }],
                { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
            );
            setPhoto(resizedPhoto);
            if(photo){
                navigation.navigate('ImageEdit', { photoUri: photo.uri });
            }
        }
    };

    const handleScan = () => {
        if(photo){
            navigation.navigate('ImageEdit', { photoUri: photo.uri });
        }
    };

    const handleSelectedCountry = async (country: string) => {
            console.log("Selected country: ", country);
            setCountry(country);
    };

    const handleBarcodeScanned = async ({ data }: { data: string }) => {
        if (isScanning && data) {
            console.log("Scanned barcode:", data);
            setBarcodeData(data);
            setIsScanning(false);

            try {
                if (country) {
                    await getProduct(data, country);
                } else {
                    await getProduct(data);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                setIsScanning(true);
            }
        }
    };

    const resetScanning = () => {
        setBarcodeData(undefined);
        setIsScanning(true);
    };

    if(!permission?.granted){
        return(
            <View style={styles.mainContainer}>
                <Text>{t('permission to use camera required')}</Text>
                <MyButton title={t('request camera permission')} onPress={requestPermission} containerStyle={{width: 'auto'}} />
            </View>
        )
    };

    if(photo){
        return(
            <View style={[styles.mainContainer]}>
                <StatusBar style='light' backgroundColor='black' />
                <View style={styles.dataContainer}>
                    <View style={styles.cameraContainer}>
                        <Image source={{uri: photo.uri}} style={styles.camera} />
                    </View>
                    <View style={{display: "flex", flexDirection:"row", gap: 50}}>
                        <MyButton title={t('advance')} onPress={handleScan} iconName='checkmark-outline' textStyle={{fontSize: 16}} />
                        <MyButton title={t('redo')} onPress={() => setPhoto(undefined)} iconName='close-outline'/>
                    </View>
                </View>
            </View>
        );
    }
    
    return (
        <View style={styles.mainContainer}>
            <StatusBar style='light' backgroundColor='black' />
            <View style={styles.dataContainer} >
                <View style={styles.buttonContainer}>
                    <MyButton 
                        title={t('barcode')} 
                        onPress={() => {setBarcodeData(undefined); setSelectedMode('barcode')}} 
                        containerStyle={[styles.button, selectedMode === 'barcode' && styles.selectedModeButton]} 
                        textStyle={[styles.buttonText]} 
                    />
                    <MyButton 
                        title={t('photo')} 
                        onPress={() => {setSelectedMode('photo')}} 
                        containerStyle={[styles.button, selectedMode === 'photo' && styles.selectedModeButton]} 
                        textStyle={[styles.buttonText]} 
                    />
                </View>
                { selectedMode === 'photo' && <Text style={globalStyles.textForPressing}>{t('take a photo of a product label to scan the text')}</Text> }
                { selectedMode === 'barcode' && 
                    <View>
                        <SelectBox 
                            title={t("location")} 
                            options={Object.keys(countryMap)} 
                            selectedOption={country} 
                            setSelectedOption={handleSelectedCountry} 
                        /> 
                        <Text style={globalStyles.textForPressing}>{t('scan a product by barcode to get started')}</Text>
                    </View>
                }
                <View style={styles.cameraContainer}>
                    <CameraView 
                        ref={cameraRef} 
                        style={styles.camera} 
                        onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined} 
                    />
                    {selectedMode === 'barcode' && barcodeData && !isScanning && (
                        <View style={styles.scanOverlay}>
                            <Text style={styles.scanText}>{t('processingBarcode')}: {barcodeData}</Text>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <MyButton 
                                title={t('cancel')} 
                                onPress={resetScanning} 
                                containerStyle={{marginTop: 20}} 
                            />
                        </View>
                    )}
                    {selectedMode === 'photo' && (
                        <TouchableOpacity style={{position: 'absolute', bottom: 20, left: 20}}>
                            <MaterialCommunityIcons name='plus' size={30} color={colors.primary} onPress={pickImage} />
                        </TouchableOpacity>
                    )}
                </View>
                {selectedMode === 'photo' ? (
                    <MyButton 
                        iconName='camera' 
                        iconColor={colors.secondary} 
                        iconSize={30} 
                        onPress={takePhoto} 
                        containerStyle={{justifyContent: 'flex-end'}} 
                    /> 
                ) : null}
            </View>
        </View>
    );
}

export default Home