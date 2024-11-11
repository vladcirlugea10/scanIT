import { View, Text, StyleSheet, Button, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { CameraCapturedPicture, CameraView, useCameraPermissions } from 'expo-camera'
import { StatusBar } from 'expo-status-bar'
import MyButton from '@/components/MyButton'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import * as ImageManipulator from 'expo-image-manipulator'

type HomeNavProps = NativeStackNavigationProp<RootStackParamList, 'Home'>

const Home = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState<CameraCapturedPicture | undefined>(undefined);
    const cameraRef = useRef<CameraView>(null);

    const navigation = useNavigation<HomeNavProps>();

    const takePhoto = async () => {
        if(cameraRef.current){
            try{
                const options = {quality: 0.5, base64: true};
                const photo = await cameraRef.current?.takePictureAsync(options);
                const resizedPhoto = await ImageManipulator.manipulateAsync(
                    photo.uri,
                    [{ resize: { width: 1500, height: 2000 } }],
                    { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
                  );
                  setPhoto(resizedPhoto);
                  console.log("photo in home:", resizedPhoto.width, resizedPhoto.height);
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
                <Button title='Request Permission' onPress={requestPermission} />
            </View>
        )
    }

    if(photo){
        return(
            <View style={styles.mainContainer}>
                <StatusBar style='light' backgroundColor='black' />
                <View style={styles.dataContainer}>
                    <View style={styles.cameraContainer}>
                        <Image source={{uri: photo.uri}} style={styles.camera} />
                    </View>
                    <View style={{display: "flex", flexDirection:"row", gap: 50}}>
                        <MyButton title='Advance' onPress={handleScan} iconName='checkmark-outline' iconColor='darkgrey'/>
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
                <View style={styles.cameraContainer}>
                    <CameraView ref={cameraRef} style={styles.camera} />
                </View>
                <MyButton iconName='camera' iconColor='darkgrey' iconSize={34} onPress={takePhoto} containerStyle={{justifyContent: 'flex-end'}} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'gray',
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
        borderRadius: 50,
    },
    navbar:{
        width: '80%',
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightblue',
    }
});

export default Home