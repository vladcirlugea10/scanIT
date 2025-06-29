import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import Home from './(tabs)/Home';
import ImageEdit from './(tabs)/ImageEdit';
import PageHeader from '@/components/PageHeader';
import { Ionicons } from '@expo/vector-icons';
import ScanImage from './(tabs)/ScanImage';
import IngredientsCheck from './(tabs)/IngredientsCheck';
import { RootStackParamList } from '@/types/StackParamsList';
import BarcodeResults from './(tabs)/BarcodeResults';
import Profile from './(tabs)/Profile';
import AuthNavigator from './AuthNavigator';
import { useTheme } from './ColorThemeContext';
import PersonalInformation from './(tabs)/PersonalInformation';
import AccountInformation from './(tabs)/AccountInformation';
import { useTranslation } from 'react-i18next';
import ChangeLanguage from './(tabs)/ChangeLanguage';
import AddProduct from './(tabs)/AddProduct';
import EditProduct from './(tabs)/EditProduct';
import AddedProducts from './(tabs)/AddedProducts';
import EditedProducts from './(tabs)/EditedProducts';
import { useAuth } from '@/hooks/useAuth';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { user, isAuth } = useAuth();

  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name='Home' component={Home} options={{header: () => <PageHeader title={isAuth ? `${t('welcome')}, ${user?.firstName}` : t('home')} backButton={false} />, headerRight: () => <Ionicons name='person-outline' size={24} color={colors.secondary}/>}} />
            <Stack.Screen name='ImageEdit' component={ImageEdit} options={{header: () => <PageHeader title={t('editImage')} backButton={true} />, headerBackVisible: false,}} />
            <Stack.Screen name='ScanImage' component={ScanImage} options={{header: () => <PageHeader title={t('scanResults')} backButton={true} />, headerBackVisible: false,}} />
            <Stack.Screen name='IngredientsCheck' component={IngredientsCheck} options={{header: () => <PageHeader title={t('checkIngredients')} backButton={true} />, headerBackVisible: false,}} />
            <Stack.Screen name='BarcodeResults' component={BarcodeResults} options={{header: () => <PageHeader title={t('result')} backButton={true} />, headerBackVisible: false}} />
            <Stack.Screen name='Profile' component={Profile} options={{header: () => <PageHeader title={t('profile')} backButton={true} />, headerBackVisible: false}} 
              listeners={{
                beforeRemove: (e) => {
                  
                }
              }}
            />
            <Stack.Screen name='PersonalInformation' component={PersonalInformation} options={{header: () => <PageHeader title={t('personalInformation')} backButton={true} />, headerBackVisible: false}} />
            <Stack.Screen name='AccountInformation' component={AccountInformation} options={{header: () => <PageHeader title={t('accountInformation')} backButton={true} />, headerBackVisible: false}} />
            <Stack.Screen name='ChangeLanguage' component={ChangeLanguage} options={{header: () => <PageHeader title={t('changeLanguage')} backButton={true} />, headerBackVisible: false}} />
            <Stack.Screen name='AddProduct' component={AddProduct} options={{header: () => <PageHeader title={t('addProduct')} backButton={true} />, headerBackVisible: false}} />
            <Stack.Screen name='EditProduct'component={EditProduct} options={{header: () => <PageHeader title={t('editProduct')} backButton={true} />, headerBackVisible: false}} />
            <Stack.Screen name='AddedProducts' component={AddedProducts} options={{header: () => <PageHeader title={t('addedProducts')} backButton={true} />, headerBackVisible: false}} />
            <Stack.Screen name='EditedProducts' component={EditedProducts} options={{header: () => <PageHeader title={t('editedProducts')} backButton={true} />, headerBackVisible: false}} />
            <Stack.Screen name='Auth' component={AuthNavigator} options={{headerShown: false}} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator