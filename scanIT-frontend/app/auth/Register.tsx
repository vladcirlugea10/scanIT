import { View, Text, StyleSheet, TextInput, ActivityIndicator, ScrollView, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyButton from '@/components/MyButton'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AuthStackParams, RootStackParamList } from '@/types/StackParamsList'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '@/hooks/useAuth'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { formatDateToString } from '@/utils/date'
import { useTheme } from '../ColorThemeContext'
import { useTranslation } from 'react-i18next'
import ShakingErrorText from '@/components/ShakingErrorText'
import { createGlobalStyles } from '@/assets/styles'
import { toastSuccess } from '@/components/ToastSuccess'
import { toastError } from '@/components/ToastError'

type RegisterNavigationProps = NativeStackNavigationProp<AuthStackParams, 'Register'>;
type ParentNavigationProps = NativeStackNavigationProp<RootStackParamList>;

const Register = () => {
  const navigation = useNavigation<RegisterNavigationProps>();
  const parentNavigation = useNavigation<ParentNavigationProps>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const { colors } = useTheme();
  const globalStyles = createGlobalStyles(colors);
  const { t } = useTranslation();

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
        gap: 20,
      },
      input:{
        borderWidth: 1,
        borderColor: colors.third,
        fontWeight: 'bold',
        color: colors.primary,
      },
      dateContainer:{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
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

  const { onRegister, error, clearError, loading } = useAuth();

  useEffect(() => {
    if(error){
      toastError(error);
    }
  }, [error]);

  const onSubmit = async () => {
    Keyboard.dismiss();
    console.log('email:', email);
    const newUser = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      birthday: formatDateToString(birthday),
    }
  
    const response = await onRegister(newUser);
    if(response){
      parentNavigation.navigate('Profile');
      toastSuccess(t('registerSuccess'));
    }
  }

  useEffect(() => {
    return () => clearError();
  }, [email, password, firstName, lastName, userName]);

  const handleShowPass = () => {
    setShowPass(!showPass);
  }

  const handleShowDate = () => {
    setShowDate(!showDate);
  }

  return (
    <ScrollView>
      <View style={styles.mainContainer}>
        <View style={globalStyles.formContainer}>
          <Text style={styles.title}>{t('createAnAccount')}</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholderTextColor={colors.primary} value={email} onChangeText={setEmail} placeholder='Email' keyboardType="email-address" autoCapitalize="none" />
            <View style={styles.passwordContainer}>
              <TextInput style={styles.input} placeholderTextColor={colors.primary} value={password} onChangeText={setPassword} placeholder={t('password')} autoCapitalize="none" secureTextEntry={!showPass} />
              <MaterialCommunityIcons name='eye' size={24} style={globalStyles.eyeIcon} onPress={handleShowPass} />
            </View>
            <TextInput style={styles.input} placeholderTextColor={colors.primary} value={userName} onChangeText={setUserName} placeholder={t('username')} autoCapitalize="none" />
            <TextInput style={styles.input} placeholderTextColor={colors.primary} value={firstName} onChangeText={setFirstName} placeholder={t('firstName')} autoCapitalize="words" />
            <TextInput style={styles.input} placeholderTextColor={colors.primary} value={lastName} onChangeText={setLastName} placeholder={t('lastName(optional)')} autoCapitalize="words" />
            <View>
              {showDate && <DateTimePicker value={new Date()} mode='date' display='spinner' maximumDate={new Date()} onChange={(event, selectedDate) => {
                if(selectedDate){
                  setBirthday(selectedDate);
                }
                setShowDate(false);
              }} />}
              <TextInput style={styles.input} placeholderTextColor={colors.primary} value={formatDateToString(birthday)} placeholder={t('birthdat(optional)')} editable={false} />
              <MaterialCommunityIcons name='calendar' size={24} style={globalStyles.eyeIcon} onPress={handleShowDate} />
            </View>
          </View>
          {loading && <ActivityIndicator size='large' color={colors.primary} />}
          {error && <ShakingErrorText text={error} />}
          <View style={styles.buttonContainer}>
            <MyButton title={t('register')} onPress={onSubmit} containerStyle={styles.button} />
            <Text style={globalStyles.textForPressing} onPress={() => {navigation.navigate('Login'); clearError();}} >{t('alreadyHaveAnAccount')}?</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default Register