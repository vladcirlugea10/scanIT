import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native'
import React from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '@/types/StackParamsList';
import ProfileSectionCard from '@/components/ProfileSectionCard';
import { useTheme } from '../ColorThemeContext';

const Profile = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors, theme, toggleTheme } = useTheme();
  const styles = StyleSheet.create({
    mainContainer:{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: '10%',
        marginTop: '5%'
    },
    cardsContainer:{
        width:'80%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
    },
    title:{
      fontWeight: 'bold',
      fontSize: 20,
      color: 'black',
    }
  });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.cardsContainer}>
        <ProfileSectionCard onPress={() => navigation.navigate('PersonalInformation')} title='Personal info' iconName='person' iconSize={24} textColor={colors.secondary} />
        <ProfileSectionCard onPress={() => navigation.navigate('AccountInformation')} title='Account info' iconName='key' iconSize={24} textColor={colors.secondary} />
        <ProfileSectionCard onPress={toggleTheme} title={theme === 'light' ? 'Dark mode' : 'Light mode'} iconName={theme === 'light' ? 'moon' : 'sunny'} iconSize={24} textColor={colors.secondary} />
      </View>
    </View>
  )
}

export default Profile