import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import Home from './(tabs)/Home';
import ImageEdit from './(tabs)/ImageEdit';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name='Home' component={Home} options={{title: "scanIT"}} />
            <Stack.Screen name='ImageEdit' component={ImageEdit} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator