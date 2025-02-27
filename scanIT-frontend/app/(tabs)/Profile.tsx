import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native'
import React from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '@/types/StackParamsList';
import ProfileSectionCard from '@/components/ProfileSectionCard';
import { useTheme } from '../ColorThemeContext';
import { useAuth } from '@/hooks/useAuth';

const Profile = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors, theme, toggleTheme } = useTheme();
  const { onLogout } = useAuth();
  const styles = StyleSheet.create({
    mainContainer:{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10%',
        backgroundColor: colors.secondary,
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

  const handleLogout = async () => {
    if(onLogout){
      await onLogout();
      navigation.navigate("Home");
    }
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.cardsContainer}>
        <ProfileSectionCard onPress={() => navigation.navigate('PersonalInformation')} title='Personal info' iconName='person' iconSize={24} textColor={colors.secondary} />
        <ProfileSectionCard onPress={() => navigation.navigate('AccountInformation')} title='Account info' iconName='key' iconSize={24} textColor={colors.secondary} />
        <ProfileSectionCard onPress={toggleTheme} title={theme === 'light' ? 'Dark mode' : 'Light mode'} iconName={theme === 'light' ? 'moon' : 'sunny'} iconSize={24} textColor={colors.secondary} />
        <ProfileSectionCard onPress={() => console.log('Notifications')} title='Notifications' iconName='notifications' iconSize={24} textColor={colors.secondary} />
        <ProfileSectionCard onPress={() => console.log('Language')} title='Language' iconName='language' iconSize={24} textColor={colors.secondary} />
        <ProfileSectionCard onPress={() => console.log('Terms of use')} title='Terms of use' iconName='help-circle' iconSize={24} textColor={colors.secondary} />
        <ProfileSectionCard onPress={handleLogout} title='Logout' iconName='log-out' iconSize={24} textColor={colors.secondary} containerStyle={{backgroundColor: colors.danger}} textStyle={{borderBottomWidth: 0}} />
      </View>
    </View>
  )
}

export default Profile