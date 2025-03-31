import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../ColorThemeContext';
import { useAuth } from '@/hooks/useAuth';
import useUser from '@/hooks/useUser';
import { calculateDays, formatDateToString } from '@/utils/date';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types/StackParamsList';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { createGlobalStyles } from '@/assets/styles';
import BarcodeModal from '@/components/BarcodeModal';
import useOpenFoodFacts from '@/hooks/useOpenFoodFacts';

const AccountInformation = () => {
    const { colors } = useTheme();
    const { user, isAuth, token } = useAuth();
    const { getProduct, notFound, loading: openFoodFactsLoading, product } = useOpenFoodFacts();
    const { t } = useTranslation();
    const { getUserData, editUser, error, loading } = useUser(token);
    
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const globalStyles = createGlobalStyles(colors);
    const [isEditing, setIsEditing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const [editedUser, setEditedUser] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        userName: user?.userName || '',
        email: user?.email || '',
        birthday: user?.birthday || '',
        height: user?.height?.toString() || '0',
        weight: user?.weight?.toString() || '0',
        gender: user?.gender || '',
      });

    const dynamicStyles = StyleSheet.create({
        input:{
          fontSize: 20,
          borderWidth: isEditing ? 1 : 0,
          borderColor: colors.primary,
          backgroundColor: isEditing ? colors.primary : 'transparent',
          color: isEditing ? colors.secondary : colors.third,
          height: 'auto',
          width: 'auto',
          paddingHorizontal: 10,
        },
    });
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
        subtitle:{
          fontSize: 20,
          fontWeight: 'bold',
          color: colors.primary,
        },
        text:{
          fontSize: 20,
          color: colors.third,
        },
        dataContainer:{
          width: '90%',
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          marginTop: '2%',
        },
        personalDataContainer:{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 5,
        },
        infoContainer:{
          width: '100%',
          height: 'auto',
          display: 'flex',
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center'
        },
        infoContainerRow:{
            height: 'auto',
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center'
        },
        allergiesContainer:{
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          marginBottom: 10,
          borderBottomWidth: 2,
          borderBottomColor: colors.primary,
        },
        allergiesTitle:{
          display: 'flex',
          flexDirection: 'row',
          marginBottom: '5%',
          gap: 20,
        },
        allergyContainer:{
          display: 'flex',
          flexDirection: 'row',
          gap: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        buttonContainer:{
          width: 'auto',
          height: 'auto',
          position: 'absolute',
          right: 10,
          top: 10,
          display: 'flex',
          flexDirection: 'row',
          gap: 10,
        },
        icon:{
          position: 'absolute',
          right: '25%',
          top: '25%'
        },
        productContainer:{

          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }
    });

    const handleEditProfile = async () => {
        if(isEditing){
          try{
              const formattedUser = {
                ...editedUser,
                height: parseFloat(editedUser.height),
                weight: parseFloat(editedUser.weight),
              }
              console.log('Edited user: ', formattedUser);
              await editUser(formattedUser);
          }catch(error){
            console.log('Error editing profile: ', error);
          }
        }
        setIsEditing(!isEditing);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedUser({
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          userName: user?.userName || '',
          email: user?.email || '',
          birthday: user?.birthday || '',
          height: user?.height?.toString() || '0',
          weight: user?.weight?.toString() || '0',
          gender: user?.gender || '',
        })
    };

    const handleModal = () => {
        setModalVisible(!modalVisible);
    }

    const checkBarcode = async (barcode: string) => {
      try {
        await getProduct(barcode);
        if (notFound) {
          Alert.alert(
            t('error'),
            t('productNotFound'),
            [{ text: 'OK', style: 'cancel' }]
          );
        } else if (product) {
          navigation.navigate("EditProduct", { barcode: barcode, product: product });
        }
      } catch (error) {
        console.log('Error getting product: ', error);
        Alert.alert(
          t('error'),
          t('errorFetchingProduct'),
          [{ text: 'OK', style: 'cancel' }]
        );
      }
    };

    const showAlert = () => {
        if(error){
          Alert.alert(
            t('error'),
            error,
            [
              {
                text: 'Ok',
                style: 'cancel',
              },
            ],
            {
              cancelable: true,
            },
          );
        }
    };

    useEffect(() => {
        if (user) {
          setEditedUser({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            userName: user.userName || '',
            email: user.email || '',
            birthday: user.birthday || '',
            height: user.height?.toString() || '0',
            weight: user.weight?.toString() || '0',
            gender: user.gender || '',
          });
        }
    }, [user]);

    useEffect(() => {
        if(!isAuth){
          navigation.navigate('Auth');
        } else{
          getUserData();
        }
    }, [isAuth]);

    if(!isAuth){
        return null;
    }
    
    if(loading){
        return (
          <View style={styles.mainContainer}>
            <ActivityIndicator size='large' color={colors.primary} />
          </View>
        );
    }
    
    if(error){
        showAlert();
    }

    return (
      <View style={styles.mainContainer}>
        <Text style={styles.title}>{t('accountInformation')}</Text>
        <View style={styles.buttonContainer}>
          { isEditing && <TouchableOpacity onPress={handleCancelEdit}> 
              <MaterialCommunityIcons name='close-circle' size={40} color={colors.danger} />
            </TouchableOpacity> 
          }
          <TouchableOpacity onPress={handleEditProfile} >
                  <MaterialCommunityIcons name={isEditing ? 'check-circle' : 'pencil-circle'} size={40} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.dataContainer}>
          <View style={styles.personalDataContainer}>
            <View style={styles.infoContainer}>
              <Text style={styles.subtitle}>{t('name')}: </Text>
              <TextInput style={dynamicStyles.input} editable={isEditing} value={editedUser.firstName} onChangeText={(text) => setEditedUser((prev) => ({...prev, firstName: text}))} />
              { editedUser.lastName ? (<TextInput style={dynamicStyles.input} editable={isEditing} value={editedUser.lastName} onChangeText={(text) => setEditedUser((prev) => ({...prev, lastName: text}))} />) :
                isEditing ? (<TextInput style={dynamicStyles.input} editable={isEditing} value='' onChangeText={(text) => setEditedUser((prev) => ({...prev, lastName: text}))}  />) : null
              }
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.subtitle}>{t('username')}: </Text>
                <TextInput style={dynamicStyles.input} editable={isEditing} value={editedUser.userName} onChangeText={(text) => setEditedUser((prev) => ({...prev, userName: text}))} />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.subtitle}>Email: </Text>
                <TextInput style={dynamicStyles.input} editable={isEditing} value={editedUser.email} onChangeText={(text) => setEditedUser((prev) => ({...prev, email: text}))} />
            </View>
            <Text style={{marginBottom: '5%'}}>
                <Text style={styles.subtitle}>{t('memberSince')}: </Text>
                <Text style={styles.text}>{ user?.createdAt ? formatDateToString(new Date(user?.createdAt)) : ''} ({calculateDays(user?.createdAt)} days)</Text>
            </Text>
            <Text style={styles.subtitle}>{t('lastScannedProducts')}: </Text>
            <View style={styles.productContainer}>
                {user?.scannedProducts && user.scannedProducts.length > 0 ? 
                  (
                    user.scannedProducts.map((product, index) => (
                      <View key={index} style={styles.infoContainerRow}>
                        <Text style={styles.text}>{product.name} - {product.brand} - {product.nutriscore.toUpperCase()}</Text>
                        <Image source={{uri: product.image}} style={{width: 50, height: 50}} />
                      </View>
                    ))
                  ) : 
                  null
                }
              <TouchableOpacity>
                <Text style={globalStyles.textForPressing} onPress={() => navigation.navigate('AddProduct')} >{t("couldntFindAproduct")}? {t("addItHere")}!</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={globalStyles.textForPressing} onPress={handleModal} >{t("editExistingProduct")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <BarcodeModal visible={modalVisible} onClose={handleModal} onPressSubmit={checkBarcode} /> 
      </View>
    )
}

export default AccountInformation