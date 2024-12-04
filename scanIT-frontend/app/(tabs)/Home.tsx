import { View, Text, StyleSheet, Button, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { CameraCapturedPicture, CameraView, useCameraPermissions, CameraPictureOptions } from 'expo-camera'
import { StatusBar } from 'expo-status-bar'
import MyButton from '@/components/MyButton'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import * as ImageManipulator from 'expo-image-manipulator'
import { colors } from '@/assets/colors'
import { RootStackParamList } from '@/types/StackParamsList'
import useOpenFoodFacts from '@/hooks/useOpenFoodFacts'

type HomeNavProps = NativeStackNavigationProp<RootStackParamList, 'Home'>

const Home = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState<CameraCapturedPicture | undefined>(undefined);
    const [selectedMode, setSelectedMode] = useState<'barcode' | 'photo'>('photo');
    const [barcodeData, setBarcodeData] = useState<string | undefined>(undefined);
    const cameraRef = useRef<CameraView>(null);
    const { getProduct, product } = useOpenFoodFacts();

    const navigation = useNavigation<HomeNavProps>();

    useEffect(() => {
        const fetchProduct = async () => {
            if(selectedMode === 'barcode' && barcodeData){
                await getProduct(barcodeData);
                console.log("home: ", product);
                if(product){
                    navigation.navigate('BarcodeResults', { product: product });
                    setBarcodeData(undefined);
                }
            }
        }
        fetchProduct();
    }, [barcodeData]);

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

    const handleScan = () => {
        if(photo){
            navigation.navigate('ImageEdit', { photoUri: photo.uri });
        }
    }

    if(!permission?.granted){
        return(
            <View style={styles.mainContainer}>
                <Text>Permission to use camera required!</Text>
                <MyButton title='Request camera permission' onPress={requestPermission} />
            </View>
        )
    }

    if(photo){
        return(
            <View style={[styles.mainContainer]}>
                <StatusBar style='light' backgroundColor='black' />
                <View style={styles.dataContainer}>
                    <View style={styles.cameraContainer}>
                        <Image source={{uri: photo.uri}} style={styles.camera} />
                    </View>
                    <View style={{display: "flex", flexDirection:"row", gap: 50}}>
                        <MyButton title='Advance' onPress={handleScan} iconName='checkmark-outline' />
                        <MyButton title='Redo' onPress={() => setPhoto(undefined)} iconName='close-outline'/>
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
                    <MyButton title='Barcode' onPress={() => {setBarcodeData(undefined); setSelectedMode('barcode'); console.log(selectedMode)}} containerStyle={[styles.button, selectedMode === 'barcode' && styles.selectedModeButton]} textStyle={[styles.buttonText]} />
                    <MyButton title='Photo' onPress={() => {setSelectedMode('photo'), console.log(selectedMode)}} containerStyle={[styles.button, selectedMode === 'photo' && styles.selectedModeButton]} textStyle={[styles.buttonText]} />
                </View>
                <View style={styles.cameraContainer}>
                    <CameraView ref={cameraRef} style={styles.camera} onBarcodeScanned={({data}) => {
                        setBarcodeData(data);
                    }} />
                </View>
                { selectedMode === 'photo' ? <MyButton iconName='camera' iconColor={colors.secondary} iconSize={30} onPress={takePhoto} containerStyle={{justifyContent: 'flex-end'}} /> : null }
            </View>
        </View>
    );
}

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
        width: 60,
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
    }
});

export default Home