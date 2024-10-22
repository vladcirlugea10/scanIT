import { View, Text, StyleSheet, Button, TouchableOpacity, Image } from 'react-native'
import React, { useRef, useState } from 'react'
import { CameraView, useCameraPermissions } from 'expo-camera'
import Ionicons from '@expo/vector-icons/Ionicons'
import { StatusBar } from 'expo-status-bar'

const HomeScreen = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState(null);
    const cameraRef = useRef<CameraView>(null);

    const takePhoto = async () => {
        if(cameraRef.current){
            try{
                const options = {quality: 0.5, base64: true};
                const photo = await cameraRef.current?.takePictureAsync(options);
                setPhoto(photo);
                console.log(photo.uri);
            }catch(err){
                console.log(err);
            }
        }
    };

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
                <View style={styles.navbar}>
                    <Text style={{color: "white", fontSize: 30, fontWeight: 800}}>scanIT</Text>
                </View>
                <View style={styles.dataContainer}>
                    <View style={styles.cameraContainer}>
                        <Image source={{uri: photo.uri}} style={styles.camera} />
                    </View>
                    <View style={{display: "flex", flexDirection:"row", gap: 50}}>
                        <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                            <Text>Scan</Text>
                            <Ionicons name="checkmark-outline" size={24} color='black' />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.photoButton} onPress={() => setPhoto(null)}>
                            <Text>Rescan</Text>
                            <Ionicons name='close-outline' size={24} color='black' />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <StatusBar style='light' backgroundColor='black' />
            <View style={styles.navbar}>
                <Text style={{color: "white", fontSize: 30, fontWeight: 800}}>scanIT</Text>
            </View>
            <View style={styles.dataContainer} >
                <View style={styles.cameraContainer}>
                    <CameraView ref={cameraRef} style={styles.camera} />
                </View>
                <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                    <Ionicons name='camera' size={24} color='black' />
                </TouchableOpacity>
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
    photoButton:{
        backgroundColor: 'lightblue',
        borderRadius: 50,
        width: 100,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
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

export default HomeScreen