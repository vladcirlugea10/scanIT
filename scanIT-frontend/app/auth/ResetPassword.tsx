import { View, Text, StyleSheet, TextInput, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyButton from '@/components/MyButton'
import { NavigationProp, RouteProp, useNavigation } from '@react-navigation/native'
import { AuthStackParams } from '@/types/StackParamsList'
import { useAuth } from '@/hooks/useAuth'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useTheme } from '../ColorThemeContext'
import { useTranslation } from 'react-i18next'
import ShakingErrorText from '@/components/ShakingErrorText'
import { toastSuccess } from '@/components/ToastSuccess'
import { toastError } from '@/components/ToastError'
import { createGlobalStyles } from '@/assets/styles'

type ResetPasswordProps = { route: RouteProp<AuthStackParams, 'ResetPassword'> };

const ResetPassword: React.FC<ResetPasswordProps> = ({route}) => {
    const { email } = route.params;
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const { changePassword, error, clearError, loading } = useAuth();
    const { colors } = useTheme();
    const { t } = useTranslation(); 
    const globalStyles = createGlobalStyles(colors);
    const navigation = useNavigation<NavigationProp<AuthStackParams>>();
    const styles = StyleSheet.create({
      mainContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.third,
      },
        title:{
          fontSize: 30,
          fontWeight: 'bold',
          color: colors.primary,
          borderBottomWidth: 2,
          borderBottomColor: colors.primary,
        },
        input:{
          borderWidth: 1,
          borderColor: colors.third,
          fontWeight: 'bold',
          color: colors.primary,
        },
        button:{
          width: '100%',
        },
        successText:{
          color: colors.success,
          fontWeight: 'bold',
        },
        passwordContainer:{
          position: 'relative',
          width: '100%',
        },
  });
    
    useEffect(() => {
        return () => clearError();
    }, [password, confirmPassword]);

    useEffect(() => {
      if (error) {
          toastError(error);
      }
    }, [error]);

    const handleSubmit = async () => {
        const response = await changePassword({email: email, password: password, confirmPassword: confirmPassword});
        if(response){
            console.log('Password changed');
            setSuccess(true);
            toastSuccess(t('passwordChangedSuccessfully'));
            setTimeout(() => {
                navigation.navigate('Login');
            }, 3000)
        }
    }

    const handleShowPass = () => {
        setShowPass(!showPass);
    }

    const handleShowConfirmPass = () => {
        setShowConfirmPass(!showConfirmPass);
    }

  return (
    <View style={styles.mainContainer}>
        <View style={[globalStyles.formContainer, {height: '80%', marginTop: '40%'}]}>
            <Text style={styles.title}>{t('enterANewPassword')}</Text>
            <View style={styles.passwordContainer}>
                <TextInput style={styles.input} placeholderTextColor={colors.primary} value={password} onChangeText={setPassword} placeholder={t('newPassword')} secureTextEntry={!showPass} autoCapitalize='none' />
                <MaterialCommunityIcons name='eye' size={24} style={globalStyles.eyeIcon} onPress={handleShowPass} />
            </View>
            <View style={styles.passwordContainer}>
                <TextInput style={styles.input} placeholderTextColor={colors.primary} value={confirmPassword} onChangeText={setConfirmPassword} placeholder={t('confirmNewPassword')} secureTextEntry={!showConfirmPass} autoCapitalize='none' />
                <MaterialCommunityIcons name='eye' size={24} style={globalStyles.eyeIcon} onPress={handleShowConfirmPass} />
            </View>
            {loading && <ActivityIndicator size='large' color={colors.primary} />}
            {error && <ShakingErrorText text={error} />}
            {success && <Text style={styles.successText}>{t('passwordChangedSuccessfully')}! {t('redirecting')}...</Text>}
            <MyButton containerStyle={styles.button} title={t('submit')} onPress={handleSubmit} />
        </View>
    </View>
  )
}

export default ResetPassword