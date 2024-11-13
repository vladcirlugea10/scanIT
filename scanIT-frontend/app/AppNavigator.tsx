import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import React from 'react'
import Home from './(tabs)/Home';
import ImageEdit from './(tabs)/ImageEdit';
import PageHeader from '@/components/PageHeader';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator<RootStackParamList>();

const BackButton = () => {
  const navigation = useNavigation();
  return (
    <View style={{ backgroundColor: 'lightblue', height: 80, justifyContent: 'center' }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name='chevron-back' size={24} />
      </TouchableOpacity>
    </View>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name='Home' component={Home} options={{headerTitle: () => <PageHeader title={"Home"} />, headerRight: () => <Ionicons name='person-outline' size={24}/>}} />
            <Stack.Screen name='ImageEdit' component={ImageEdit} options={{headerTitle: () => <PageHeader title={"Edit image"} />, headerRight: () => <BackButton />, headerBackVisible: false,}} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator