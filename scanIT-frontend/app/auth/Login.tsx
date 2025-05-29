import { View, Text, StyleSheet, TextInput, Keyboard, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import MyButton from '@/components/MyButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParams, RootStackParamList } from '@/types/StackParamsList';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../ColorThemeContext';
import { useTranslation } from 'react-i18next';
import ShakingErrorText from '@/components/ShakingErrorText';
import { createGlobalStyles } from '@/assets/styles';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import Animated from 'react-native-reanimated';
import { waveKeyframe } from '@/assets/animations';
import { toastSuccess } from '@/components/ToastSuccess';
import { toastError } from '@/components/ToastError';

type LoginNavProps = NativeStackNavigationProp<AuthStackParams, 'Login'>;
type ParentNavigationProps = NativeStackNavigationProp<RootStackParamList>;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const { onLogin, error, clearError, loading, isAuth } = useAuth();
  const { colors } = useTheme();
  const globalStyles = createGlobalStyles(colors);
  const { t } = useTranslation();
  const { promptAsync, request } = useGoogleAuth();

  const navigation = useNavigation<LoginNavProps>();
  const parentNavigation = useNavigation<ParentNavigationProps>();
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.third
    },
    title:{
      fontSize: 30,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: '5%',
    },
    inputContainer:{
      display: 'flex',
      flexDirection: 'column',
      gap: 30,
    },
    input:{
      borderWidth: 1,
      borderColor: colors.third,
      fontWeight: 'bold',
      color: colors.primary,
      paddingRight: 40,
    },
    button:{
      width: '100%',
    },
    buttonContainer:{
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    },
    passwordContainer:{
      position: 'relative',
      width: '100%',
    },
  });

  useEffect(() => {
    return () => clearError();
  }, [email, password]);

  useEffect(() => {
    if(error){
      toastError(error);
    }
  }, [error]);

  const onSubmit = async () => {
    Keyboard.dismiss();
    const loginData = {
      email: email,
      password: password,
    }

    const response = await onLogin(loginData);
    console.log(response);
    if(response){
      parentNavigation.navigate('Profile');
      toastSuccess(t('loginSuccess'));
    }
  }

  const handleShowPass = () => {
    setShowPass(!showPass);
  }

  useFocusEffect(
    useCallback(() => {
      if(isAuth){
        parentNavigation.navigate('Profile');
      }
    }, [isAuth])
  )

  const handleGoogleLogin = async () => {
    if (request) {
      const result = await promptAsync();
      console.log("Google login result:", result);
    } else {
      console.log("Request not ready yet.");
    }
  }

  return (
    <ScrollView>
      <View style={styles.mainContainer}>
          <View style={[globalStyles.formContainer, {marginTop: "80%"}]}>
            <View style={[globalStyles.rowContainer, {gap: 20, alignItems: 'baseline'}]}>
              <Text style={styles.title}>{t('welcomeBack')}!</Text>
              <Animated.Text entering={waveKeyframe.duration(3000)} style={{fontSize: 40}}>👋</Animated.Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholderTextColor={colors.primary} value={email} onChangeText={setEmail} placeholder='Email' keyboardType="email-address" autoCapitalize="none" />
              <View style={styles.passwordContainer}>
                <TextInput style={styles.input} placeholderTextColor={colors.primary} value={password} onChangeText={setPassword} placeholder={t('password')} autoCapitalize="none" secureTextEntry={!showPass} />
                <MaterialCommunityIcons name='eye' size={24} style={globalStyles.eyeIcon} onPress={handleShowPass} />
              </View>
              {loading && <ActivityIndicator size='large' color={colors.primary} />}
              {error && <ShakingErrorText text={error} />}
            </View>
            <View style={styles.buttonContainer}>
              <MyButton title={t('login')} onPress={onSubmit} containerStyle={styles.button} />
              <Text style={globalStyles.textForPressing} onPress={() => {navigation.navigate('ForgotPassword'); clearError()}}>{t('forgotPassword')}?</Text>
              <Text style={globalStyles.textForPressing} onPress={() => {navigation.navigate('Register'); clearError()}}>{t('createAnAccount')}</Text>
            </View>
            <View style={{display: 'flex', flexDirection: 'row', gap: 10, marginTop: 20, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={globalStyles.textForPressing} >{t('authWith')}:</Text>
              <TouchableOpacity onPress={handleGoogleLogin}>
                <Image source={require('@/assets/images/google.png')} style={{width: 30, height: 30}} />
              </TouchableOpacity>
            </View>
          </View>
      </View>
    </ScrollView>
  )
}

export default Login