import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import { colors } from '@/assets/colors'
import MyButton from '@/components/MyButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParams } from '@/types/StackParamsList';
import { useNavigation } from '@react-navigation/native';

type LoginNavProps = NativeStackNavigationProp<AuthStackParams, 'Login'>;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation<LoginNavProps>();

  const onSubmit = () => {
    console.log('email:', email);
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome back!</Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder='email' keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder='password' autoCapitalize="none" secureTextEntry />
        </View>
        <View style={styles.buttonContainer}>
          <MyButton title='Login' onPress={onSubmit} containerStyle={styles.button} />
          <Text style={styles.text} onPress={() => navigation.navigate('ForgotPassword')}>Forgot password?</Text>
          <Text style={styles.text} onPress={() => navigation.navigate('Register')}>Create an account</Text>
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
    marginTop: '70%',
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
  }
})

export default Login