import { View, Text, StyleSheet, TextInput, ActivityIndicator, ScrollView, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '@/assets/colors'
import MyButton from '@/components/MyButton'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AuthStackParams, RootStackParamList } from '@/types/StackParamsList'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '@/hooks/useAuth'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { formatDateToString } from '@/utils/date'
import { useTheme } from '../ColorThemeContext'

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
        marginTop: '60%',
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
      text:{
        color: colors.third,
        fontWeight: 'bold',
        fontSize: 15,
      },
      errorText:{
        fontWeight: 'bold',
        color: colors.danger,
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
  });

  const { onRegister, error, clearError, loading } = useAuth();

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
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create an account</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder='Email' keyboardType="email-address" autoCapitalize="none" />
            <View style={styles.passwordContainer}>
              <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder='Password' autoCapitalize="none" secureTextEntry={!showPass} />
              <MaterialCommunityIcons name='eye' size={24} style={styles.eyeIcon} onPress={handleShowPass} />
            </View>
            <TextInput style={styles.input} value={userName} onChangeText={setUserName} placeholder='Username' autoCapitalize="none" />
            <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder='First name' autoCapitalize="words" />
            <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder='Last name(optional)' autoCapitalize="words" />
            <View>
              {showDate && <DateTimePicker value={new Date()} mode='date' display='spinner' maximumDate={new Date()} onChange={(event, selectedDate) => {
                if(selectedDate){
                  setBirthday(selectedDate);
                }
                setShowDate(false);
              }} />}
              <TextInput style={styles.input} value={formatDateToString(birthday)} placeholder='Birthday(optional)' editable={false} />
              <MaterialCommunityIcons name='calendar' size={24} style={styles.eyeIcon} onPress={handleShowDate} />
            </View>
          </View>
          {loading && <ActivityIndicator size='large' color={colors.primary} />}
          {error && <Text style={styles.errorText}>{error}</Text>}
          <View style={styles.buttonContainer}>
            <MyButton title='Register' onPress={onSubmit} containerStyle={styles.button} />
            <Text style={styles.text} onPress={() => navigation.navigate('Login')} >Already have an account?</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default Register