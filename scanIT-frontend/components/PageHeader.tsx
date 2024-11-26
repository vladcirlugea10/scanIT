import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { colors } from '@/assets/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from './BackButton';
import { Ionicons } from '@expo/vector-icons';

const PageHeader = ({title, backButton}: {title: string, backButton: boolean}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <View style={styles.titleContainer}>
                <Image style={styles.headerLogo} source={require('@/assets/images/logo_nobg_white.png')} />
                <Text style={styles.headerText} >{title}</Text>
            </View>
            <View>
                {backButton ? (<BackButton />) : (<Ionicons name="person-outline" size={24} color={colors.secondary} />)}
            </View>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: colors.third,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        width: '100%',
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: colors.third,
    },    
    headerText: {
        color: colors.secondary,
        fontSize: 30,
    },
    headerLogo: {
        width: 80,
        height: 80,
    }
});

export default PageHeader