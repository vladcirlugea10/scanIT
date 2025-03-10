import { View, Text, StyleSheet } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated'

interface ShakingErrorTextProps {
    text: string;
}

const ShakingErrorText = ({text} : ShakingErrorTextProps) => {
    const shakeTranslateX = useSharedValue(0);

    const styles = StyleSheet.create({
        text: {
            color: 'red',
            fontWeight: 'bold',
            fontSize: 15,
        }
    });

    const shake = useCallback(() => {
        const TranslationAmount = 10;
        const timingConfig = {
            duration: 120,
        }
        shakeTranslateX.value = withSequence(
            withTiming(TranslationAmount, timingConfig),
            withRepeat(withTiming(-TranslationAmount, timingConfig), 3, true),
            withTiming(0),
        );
    }, []);

    const rShakeStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: shakeTranslateX.value }],
        };
    }, []);

    useEffect(() => {
        shake();
    }, []);

    return (
        <View>
            <Animated.Text style={[styles.text, rShakeStyle]}>{text}</Animated.Text>
        </View>
    );
}


export default ShakingErrorText