import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types/StackParamsList';

const Profile = () => {
  const { isAuth } = useAuth();
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
    <View>
      <Text>Profile</Text>
    </View>
  )
}

export default Profile