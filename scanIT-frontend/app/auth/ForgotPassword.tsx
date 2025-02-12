import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import { colors } from '@/assets/colors'
import MyButton from '@/components/MyButton';
import { useAuth } from '@/hooks/useAuth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { forgotPassword } = useAuth();

  const handleForgotPass = async () => {
    if(email){
      const response = await forgotPassword(email);
      if(response){
        console.log('Reset link sent!');
        setSent(true);
      }
    }
  } 

  return (
    <View style={styles.mainContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Enter your account's email to receive a reset link.</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder='Your email' keyboardType="email-address" autoCapitalize='none' />
        {sent && <Text style={styles.successText}>The email has been sent! Check your inbox.</Text>}
        <MyButton containerStyle={styles.button} title='Send reset link' onPress={handleForgotPass} />
      </View>
    </View>
  )
}

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
})

export default ForgotPassword