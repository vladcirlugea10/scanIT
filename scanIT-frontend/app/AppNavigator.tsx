import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import Home from './(tabs)/Home';
import ImageEdit from './(tabs)/ImageEdit';
import PageHeader from '@/components/PageHeader';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/assets/colors';
import ScanImage from './(tabs)/ScanImage';
import IngredientsCheck from './(tabs)/IngredientsCheck';
import { RootStackParamList } from '@/types/StackParamsList';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name='Home' component={Home} options={{header: () => <PageHeader title={"Home"} backButton={false} />, headerRight: () => <Ionicons name='person-outline' size={24} color={colors.secondary}/>}} />
            <Stack.Screen name='ImageEdit' component={ImageEdit} options={{header: () => <PageHeader title={"Edit image"} backButton={true} />, headerBackVisible: false,}} />
            <Stack.Screen name='ScanImage' component={ScanImage} options={{header: () => <PageHeader title={"Scan results"} backButton={true} />, headerBackVisible: false,}} />
            <Stack.Screen name='IngredientsCheck' component={IngredientsCheck} options={{header: () => <PageHeader title={"Check Ingredients"} backButton={true} />, headerBackVisible: false,}} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator