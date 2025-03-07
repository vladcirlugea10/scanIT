import { View, Text, StyleSheet, TextInput, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyButton from '@/components/MyButton';
import { useAuth } from '@/hooks/useAuth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParams } from '@/types/StackParamsList';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ColorThemeContext';
import { useTranslation } from 'react-i18next';

type ForgotPasswordProps = NativeStackNavigationProp<AuthStackParams, 'ForgotPassword'>;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const { forgotPassword, checkResetCode, loading, error, clearError } = useAuth();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<ForgotPasswordProps>();
  const styles = StyleSheet.create({
    mainContainer:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.secondary
    },
    formContainer:{
      width: '100%',
      height: '80%',
      backgroundColor: colors.white,
      marginTop: '40%',
      gap: 30,
      padding: '10%',
      display: 'flex',
      flexDirection: 'column',
    },
    title:{
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.third,
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
    },
    errorText:{
      color: colors.danger,
      fontWeight: 'bold',
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
    }
  });

  useEffect(() => {
    return () => clearError();
  }, [email, code]);

  const handleForgotPass = async () => {
    if(email){
      const response = await forgotPassword(email);
      if(response){
        console.log('Reset link sent!');
        setStep(2);
      }
    }
  }
  
  const handleCheckCode = async () => {
    if(code){
      const response = await checkResetCode(code);
      if(response){
        console.log('Code is correct!');
        navigation.navigate('ResetPassword', { email: email });
      }
    }
  }

  return (
    step === 1 ? (
      <View style={styles.mainContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>{t('enterAValidEmailToResetThePassword')}.</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder={t('yourEmail')} keyboardType="email-address" autoCapitalize='none' />
          {loading && <ActivityIndicator size='large' color={colors.primary} />}
          {error && <Text style={styles.errorText}>{error}</Text>}
          <MyButton containerStyle={styles.button} title={t('sendResetLink')} onPress={handleForgotPass} />
        </View>
      </View>
    ) : (
      <View style={styles.mainContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>{t('enterThe6DigitCode')}</Text>
          <TextInput style={styles.input} value={code} onChangeText={setCode} placeholder={t('code')} keyboardType='numeric' />
          {loading && <ActivityIndicator size='large' color={colors.primary} />}
          {error && <Text style={styles.errorText}>{error}</Text>}
          <MyButton containerStyle={styles.button} title={t('submit')} onPress={handleCheckCode} />
        </View>
      </View>
    )
    
  )
}

export default ForgotPassword