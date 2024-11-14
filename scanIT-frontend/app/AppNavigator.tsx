import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import React from 'react'
import Home from './(tabs)/Home';
import ImageEdit from './(tabs)/ImageEdit';
import PageHeader from '@/components/PageHeader';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/assets/colors';
import ScanImage from './(tabs)/ScanImage';

const Stack = createNativeStackNavigator<RootStackParamList>();

const BackButton = () => {
  const navigation = useNavigation();
  return (
    <View style={{ backgroundColor: colors.third, height: 80, justifyContent: 'center' }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name='chevron-back' size={24} color={colors.secondary} />
      </TouchableOpacity>
    </View>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name='Home' component={Home} options={{headerTitle: () => <PageHeader title={"Home"} />, headerRight: () => <Ionicons name='person-outline' size={24} color={colors.secondary}/>}} />
            <Stack.Screen name='ImageEdit' component={ImageEdit} options={{headerTitle: () => <PageHeader title={"Edit image"} />, headerRight: () => <BackButton />, headerBackVisible: false,}} />
            <Stack.Screen name='ScanImage' component={ScanImage} options={{headerTitle: () => <PageHeader title={"Scan image"} />, headerRight: () => <BackButton />, headerBackVisible: false,}} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator