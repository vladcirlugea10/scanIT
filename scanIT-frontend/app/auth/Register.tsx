import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '@/assets/colors'
import MyButton from '@/components/MyButton'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AuthStackParams, RootStackParamList } from '@/types/StackParamsList'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '@/hooks/useAuth'
import { MaterialCommunityIcons } from '@expo/vector-icons'

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
  const [showPass, setShowPass] = useState(false);

  const { onRegister, error, clearError } = useAuth();

  const onSubmit = async () => {
    console.log('email:', email);
    const newUser = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      userName: userName,
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

  return (
    <View style={styles.mainContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create an account</Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder='Email' keyboardType="email-address" autoCapitalize="none" />
          <View style={styles.passwordContainer}>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder='Password' autoCapitalize="none" secureTextEntry={!showPass} />
            <MaterialCommunityIcons name='eye' size={24} style={styles.eyeIcon} onPress={handleShowPass} />
          </View>
          <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder='First name' autoCapitalize="words" />
          <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder='Last name(optional)' autoCapitalize="words" />
          <TextInput style={styles.input} value={userName} onChangeText={setUserName} placeholder='Username(optional)' autoCapitalize="none" />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <View style={styles.buttonContainer}>
          <MyButton title='Register' onPress={onSubmit} containerStyle={styles.button} />
          <Text style={styles.text} onPress={() => navigation.navigate('Login')} >Already have an account?</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
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
})

export default Register