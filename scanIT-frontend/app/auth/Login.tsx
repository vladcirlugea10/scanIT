import { View, Text, StyleSheet, TextInput, Keyboard, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyButton from '@/components/MyButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParams, RootStackParamList } from '@/types/StackParamsList';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../ColorThemeContext';
import { useTranslation } from 'react-i18next';
import ShakingErrorText from '@/components/ShakingErrorText';
import { createGlobalStyles } from '@/assets/styles';

type LoginNavProps = NativeStackNavigationProp<AuthStackParams, 'Login'>;
type ParentNavigationProps = NativeStackNavigationProp<RootStackParamList>;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const { onLogin, error, clearError, loading } = useAuth();
  const { colors } = useTheme();
  const globalStyles = createGlobalStyles(colors);
  const { t } = useTranslation();

  const navigation = useNavigation<LoginNavProps>();
  const parentNavigation = useNavigation<ParentNavigationProps>();
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.secondary
    },
    formContainer:{
      width: '100%',
      height: '100%',
      backgroundColor: colors.white,
      marginTop: '80%',
      gap: 30,
      padding: '10%',
      display: 'flex',
      flexDirection: 'column',
    },
    title:{
      fontSize: 30,
      fontWeight: 'bold',
      color: colors.third,
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
    eyeIcon:{
      position: 'absolute',
      right: 10,
      top: '25%',
      color: colors.primary,
    },
    errorText:{
      color: 'red',
      fontWeight: 'bold',
    }
  });

  useEffect(() => {
    return () => clearError();
  }, [email, password]);

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
    }
  }

  const handleShowPass = () => {
    setShowPass(!showPass);
  }

  return (
    <ScrollView>
      <View style={styles.mainContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>{t('welcomeBack')}!</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder='Email' keyboardType="email-address" autoCapitalize="none" />
              <View style={styles.passwordContainer}>
                <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder={t('password')} autoCapitalize="none" secureTextEntry={!showPass} />
                <MaterialCommunityIcons name='eye' size={24} style={styles.eyeIcon} onPress={handleShowPass} />
              </View>
              {loading && <ActivityIndicator size='large' color={colors.primary} />}
              {error && <ShakingErrorText text={error} />}
            </View>
            <View style={styles.buttonContainer}>
              <MyButton title={t('login')} onPress={onSubmit} containerStyle={styles.button} />
              <Text style={globalStyles.textForPressing} onPress={() => {navigation.navigate('ForgotPassword'); clearError()}}>{t('forgotPassword')}?</Text>
              <Text style={globalStyles.textForPressing} onPress={() => {navigation.navigate('Register'); clearError()}}>{t('createAnAccount')}</Text>
            </View>
          </View>
      </View>
    </ScrollView>
  )
}

export default Login