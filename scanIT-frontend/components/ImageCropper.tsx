import { View, Dimensions, PanResponder, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import MyButton from './MyButton';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const ImageCropper = ({imageUri, onCropComplete}) => {
    const [cropArea, setCropArea] = useState({
        x: 0,
        y: 0,
        width: screenWidth * 0.6,
        height: screenHeight * 0.4
    });
    const [imageSize, setImageSize] = useState({width: 0, height: 0});
    const [displayDimensions, setDisplayDimensions] = useState({
        width: 0,
        height: 0,
        x: 0,
        y: 0
    });

    useEffect(() => {
        Image.getSize(imageUri, (width, height) => {
            setImageSize({width, height});
            
            const imageRatio = width / height;
            const screenRatio = (screenWidth * 0.85) / (screenHeight * 0.8);  
            let displayWidth, displayHeight;
            let offsetX = 0, offsetY = 0;
            
            if (imageRatio > screenRatio) {
                displayWidth = screenWidth * 0.85;
                displayHeight = displayWidth / imageRatio;
                offsetY = ((screenHeight * 0.8) - displayHeight) / 2;
            } else {
                displayHeight = screenHeight * 0.8;
                displayWidth = displayHeight * imageRatio;
                offsetX = ((screenWidth * 0.85) - displayWidth) / 2;
            }
            
            setDisplayDimensions({
                width: displayWidth,
                height: displayHeight,
                x: offsetX,
                y: offsetY
            });

            const cropWidth = Math.min(displayWidth * 0.8, screenWidth * 0.6);
            const cropHeight = Math.min(displayHeight * 0.8, screenHeight * 0.4);
            setCropArea({
                x: offsetX + (displayWidth - cropWidth) / 2,
                y: offsetY + (displayHeight - cropHeight) / 2,
                width: cropWidth,
                height: cropHeight
            });
        });
    }, [imageUri]);

    const handleImageCropping = (handlePosition: string) => {
        return PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gestureState) => {
                let newCropArea = {...cropArea};
                const minSize = 50;
                
                const maxX = displayDimensions.x + displayDimensions.width;
                const maxY = displayDimensions.y + displayDimensions.height;
                
                switch(handlePosition) {
                    case 'topLeft':
                        newCropArea.x = Math.max(
                            displayDimensions.x,
                            Math.min(cropArea.x + gestureState.dx, cropArea.x + cropArea.width - minSize)
                        );
                        newCropArea.y = Math.max(
                            displayDimensions.y,
                            Math.min(cropArea.y + gestureState.dy, cropArea.y + cropArea.height - minSize)
                        );
                        newCropArea.width = cropArea.x + cropArea.width - newCropArea.x;
                        newCropArea.height = cropArea.y + cropArea.height - newCropArea.y;
                        break;
                    case 'topRight':
                        const newWidthTR = Math.max(minSize, Math.min(
                            cropArea.width + gestureState.dx,
                            maxX - cropArea.x
                        ));
                        newCropArea.y = Math.max(
                            displayDimensions.y,
                            Math.min(cropArea.y + gestureState.dy, cropArea.y + cropArea.height - minSize)
                        );
                        newCropArea.width = newWidthTR;
                        newCropArea.height = cropArea.y + cropArea.height - newCropArea.y;
                        break;
                    case 'bottomLeft':
                        newCropArea.x = Math.max(
                            displayDimensions.x,
                            Math.min(cropArea.x + gestureState.dx, cropArea.x + cropArea.width - minSize)
                        );
                        newCropArea.width = cropArea.x + cropArea.width - newCropArea.x;
                        newCropArea.height = Math.max(minSize, Math.min(
                            cropArea.height + gestureState.dy,
                            maxY - cropArea.y
                        ));
                        break;
                    case 'bottomRight':
                        newCropArea.width = Math.max(minSize, Math.min(
                            cropArea.width + gestureState.dx,
                            maxX - cropArea.x
                        ));
                        newCropArea.height = Math.max(minSize, Math.min(
                            cropArea.height + gestureState.dy,
                            maxY - cropArea.y
                        ));
                        break;
                }
                setCropArea(newCropArea);
            },
            onPanResponderRelease: () => {
                console.log('Released');
            }
        });
    };

    const handleCompleteCrop = () => {
        if (!imageSize.width || !imageSize.height) return;

        const scaleX = imageSize.width / displayDimensions.width;
        const scaleY = imageSize.height / displayDimensions.height;
        
        const cropImageArea = {
            originX: Math.max(0, Math.round((cropArea.x - displayDimensions.x) * scaleX)),
            originY: Math.max(0, Math.round((cropArea.y - displayDimensions.y) * scaleY)),
            width: Math.min(imageSize.width, Math.round(cropArea.width * scaleX)),
            height: Math.min(imageSize.height, Math.round(cropArea.height * scaleY))
        };

        onCropComplete(cropImageArea);
    };

    return (
        <View style={styles.container}>
            <Image 
                style={[styles.image, {
                    width: displayDimensions.width,
                    height: displayDimensions.height,
                    left: displayDimensions.x,
                    top: displayDimensions.y
                }]} 
                source={{uri: imageUri}} 
            />
            <View style={[styles.cropArea, {
                left: cropArea.x,
                top: cropArea.y,
                width: cropArea.width,
                height: cropArea.height
            }]}>
                <View {...handleImageCropping('topLeft').panHandlers} style={[styles.cropButton, {top: -10, left: -10}]} />
                <View {...handleImageCropping('topRight').panHandlers} style={[styles.cropButton, {top: -10, right: -10}]} />
                <View {...handleImageCropping('bottomLeft').panHandlers} style={[styles.cropButton, {bottom: -10, left: -10}]} />
                <View {...handleImageCropping('bottomRight').panHandlers} style={[styles.cropButton, {bottom: -10, right: -10}]} />
            </View>
            <MyButton title='Complete' onPress={handleCompleteCrop} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000AA'
    },
    image: {
        position: 'absolute',
        resizeMode: 'contain'
    },
    cropArea: {
        borderWidth: 2,
        borderColor: 'white',
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.2)'
    },
    cropButton: {
        width: 20,
        height: 20,
        backgroundColor: 'white',
        position: 'absolute',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#666'
    }
});

export default ImageCropper;