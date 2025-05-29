import { View, StyleSheet, Alert } from 'react-native'
import React from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '@/types/StackParamsList';
import ProfileSectionCard from '@/components/ProfileSectionCard';
import { useTheme } from '../ColorThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { toastSuccess } from '@/components/ToastSuccess';

const Profile = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors, theme, toggleTheme } = useTheme();
  const { onLogout } = useAuth();
  const { t } = useTranslation();
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
  };

  const handleChangeColorScheme = () => {
    toggleTheme();
    toastSuccess(t("colorSchemeChanged"));
  };

  const showAlert = () => {
    Alert.alert(
      t('logout'),
      t('areYouSureLogout'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        { text: t('yes'), onPress: handleLogout },
      ],
      { cancelable: false }
    )
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.cardsContainer}>
        <ProfileSectionCard onPress={() => navigation.navigate('PersonalInformation')} title={t('personalInfo')} iconName='person' iconSize={24} textColor={colors.secondary} />
        <ProfileSectionCard onPress={() => navigation.navigate('AccountInformation')} title={t('accountInfo')} iconName='key' iconSize={24} textColor={colors.secondary} />
        <ProfileSectionCard onPress={() => navigation.navigate('AddedProducts')} title={t('addedProducts')} iconName='add-circle' iconSize={24} textColor={colors.secondary} />
        <ProfileSectionCard onPress={() => navigation.navigate('EditedProducts')} title={t('editedProducts')} iconName='create' iconSize={24} textColor={colors.secondary} />
        <ProfileSectionCard onPress={handleChangeColorScheme} title={theme === 'light' ? t('darkMode') : t('lightMode')} iconName={theme === 'light' ? 'moon' : 'sunny'} iconSize={24} textColor={colors.secondary} />
        <ProfileSectionCard onPress={() => navigation.navigate('ChangeLanguage')} title={t('languageAndLocation')} iconName='language' iconSize={24} textColor={colors.secondary} />
        <ProfileSectionCard onPress={() => console.log('Terms of use')} title={t('termsOfUse')} iconName='help-circle' iconSize={24} textColor={colors.secondary} />
        <ProfileSectionCard onPress={showAlert} title={t('logout')} iconName='log-out' iconSize={24} textColor={colors.secondary} containerStyle={{backgroundColor: colors.danger, marginTop: "15%"}} textStyle={{borderBottomWidth: 0}} />
      </View>
    </View>
  )
}

export default Profile