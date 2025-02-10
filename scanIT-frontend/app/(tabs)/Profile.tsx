import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types/StackParamsList';
import { colors } from '@/assets/colors';

const Profile = () => {
  const { isAuth, user } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if(!isAuth){
      navigation.navigate('Auth');
    }
  }, [isAuth]);

  if(!isAuth){
    return null;
  }

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Personal information</Text>
      <View style={styles.dataContainer}>
        <Text>Name: {user?.firstName} {user?.lastName}</Text>
        <Text>Username: {user?.userName}</Text>
        <Text>Email: {user?.email}</Text>
        <Text>Member since: {user?.createdAt}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.secondary,
    display: 'flex',
    flexDirection: 'column',
    padding: '5%',
  },
  title:{
    fontSize: 25,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  dataContainer:{
    width: '90%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
  }
});

export default Profile