import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types/StackParamsList';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SelectBox from '@/components/SelectBox';
import { formatDateToString, calculateAge } from '@/utils/date';
import { AllergenGroups } from '@/types/AllergenIngredient';
import useUser from '@/hooks/useUser';
import DateTimePicker from '@react-native-community/datetimepicker'
import { calculateCalories } from '@/utils/calloriesCalculator';
import { useTheme } from '../ColorThemeContext';
import { useTranslation } from 'react-i18next';
import { toastSuccess } from '@/components/ToastSuccess';

const PersonalInformation = () => {
  const { isAuth, user, token } = useAuth();
  const { addAllergy, loading, error, getUserData, editUser, removeAllergy } = useUser(token);
  const { t } = useTranslation();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  const [showSelectBox, setShowSelectBox] = useState(false);
  const [selectedAllergy, setSelectedAllergy] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  const { colors } = useTheme();
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
      gap: 5,
      alignItems: 'center'
    },
    infoContainerRow:{
        height: 'auto',
        display: 'flex',
        flexDirection: 'row',
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
    }
  });

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

  useEffect(() => {
    if (selectedGender) {
      setEditedUser(prev => ({ ...prev, gender: selectedGender }));
    }
  }, [selectedGender]);

  const handleAddAllergy = async () => {
    if(selectedAllergy){
      try{
          await addAllergy(selectedAllergy);
          setShowSelectBox(false);
          setSelectedAllergy('');
          toastSuccess(t('accountInfoEdited'));
      } catch(error){
          console.log('Error adding allergy: ', error);
      }
    }
  }

  const handleRemoveAllergy = async (allergy: string) => {
    if(allergy){
      try{
          await removeAllergy(allergy);
          toastSuccess(t('accountInfoEdited'));
      } catch(error){
          console.log('Error removing allergy: ', error);
        }
    }
  }

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
          toastSuccess(t('accountInfoEdited'));
      }catch(error){
        console.log('Error editing profile: ', error);
      }
    }
    setIsEditing(!isEditing);
  }

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
  }

  const handleSelectBox = () => {
    setShowSelectBox(!showSelectBox);
  }

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

  const handleShowDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  }

  const showAlert = () => {
    if(error){
      Alert.alert(
        t('error')+'!',
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
        <Text style={styles.title}>{t('personalInformation')}</Text>
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
              <Text style={styles.subtitle}>{t('name')}:</Text>
              <TextInput style={dynamicStyles.input} editable={isEditing} value={editedUser.firstName} onChangeText={(text) => setEditedUser((prev) => ({...prev, firstName: text}))} />
              { editedUser.lastName ? (<TextInput style={dynamicStyles.input} editable={isEditing} value={editedUser.lastName} onChangeText={(text) => setEditedUser((prev) => ({...prev, lastName: text}))} />) :
                isEditing ? (<TextInput style={dynamicStyles.input} editable={isEditing} value='' onChangeText={(text) => setEditedUser((prev) => ({...prev, lastName: text}))}  />) : null
              }
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.subtitle}>{t('birthday')}:</Text>
              <TextInput style={dynamicStyles.input} editable={isEditing} value={ editedUser?.birthday ? (editedUser?.birthday) : ''} />
              { !isEditing && editedUser.birthday && <Text style={styles.text}>({calculateAge(new Date(editedUser.birthday.split('-').reverse().join('-')))} {t('yearsOld')})</Text>}
              { isEditing && <MaterialCommunityIcons style={styles.icon} name='calendar' size={24} color={colors.primary} onPress={handleShowDatePicker} /> }
              { showDatePicker && <DateTimePicker value={editedUser.birthday ? new Date(editedUser.birthday.split('-').reverse().join('-')) : new Date()} mode='date' display='spinner' maximumDate={new Date()} onChange={(event, selectedDate) => {
                if(selectedDate){
                  setEditedUser((prev) => ({...prev, birthday: formatDateToString(selectedDate)}));
                }
                setShowDatePicker(false);
              }} /> }
            </View>
            <View style={styles.allergiesContainer}>
              <View style={styles.allergiesTitle}> 
                  <Text style={styles.subtitle}>{t('allergies')}: </Text>
                  <TouchableOpacity>
                      { showSelectBox ? <MaterialCommunityIcons name='minus-box' size={24} color={colors.danger} onPress={handleSelectBox} /> : <MaterialCommunityIcons name='plus-box' size={24} color={colors.third} onPress={handleSelectBox} /> }
                  </TouchableOpacity>
                  { showSelectBox && 
                      <View style={{position: 'absolute', display: 'flex', right: 0, flexDirection: 'row', gap: 10}}>
                          <SelectBox style={{width: 'auto'}} title={t('selectAnAllergy')} options={AllergenGroups} selectedOption={selectedAllergy} setSelectedOption={setSelectedAllergy} />
                          <TouchableOpacity>
                              <MaterialCommunityIcons name='check' size={24} color={colors.primary} onPress={handleAddAllergy} />
                          </TouchableOpacity>
                      </View> 
                  }
              </View>
              { user?.allergies && user?.allergies.length > 0 ? user?.allergies?.map((allergy, index) => (
                  <View style={styles.allergyContainer} key={index}>
                      <Text style={{marginLeft: '5%', color: colors.third}}>{allergy}</Text>
                      <TouchableOpacity>
                          <MaterialCommunityIcons name='minus-box' size={24} color={colors.danger} onPress={() => handleRemoveAllergy(allergy)} />
                      </TouchableOpacity>
                  </View>
                )) : <Text style={{marginLeft: '5%'}} >{t('youDontHaveAnyAllergies')}</Text>
              }
            </View>
            <View style={{display: 'flex', flexDirection: 'row', gap: "5%"}}>
              <View style={styles.infoContainerRow}>
                <Text style={styles.subtitle}>{t('height')}(cm): </Text>
                <TextInput style={dynamicStyles.input} editable={isEditing} value={ editedUser.height ? editedUser.height : '0'} keyboardType='numeric' onChangeText={(text) => setEditedUser((prev) => ({...prev, height: text}))} />
              </View>
              <View style={styles.infoContainerRow}>
                <Text style={styles.subtitle}>{t('weight')}(kg): </Text>
                <TextInput style={dynamicStyles.input} editable={isEditing} value={ editedUser.weight ? editedUser.weight : '0'} keyboardType='numeric' onChangeText={(text) => setEditedUser((prev) => ({...prev, weight: text}))} />
              </View>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.subtitle}>{t('youAre')}: </Text>
                { editedUser?.gender && <TextInput style={dynamicStyles.input} editable={false} value={editedUser?.gender ? editedUser.gender : ''} /> }
                { isEditing && <SelectBox title={t('selectGender')} options={['Male', 'Female']} selectedOption={selectedGender} setSelectedOption={setSelectedGender} /> }
            </View>
              <Text>
                <Text style={styles.text}>{t('yourAverageDailyCaloriesIntake')}: </Text>
                <Text style={styles.subtitle}>{calculateCalories(parseInt(editedUser?.weight), parseInt(editedUser?.height), calculateAge(new Date(editedUser.birthday.split('-').reverse().join('-'))) || 0, editedUser.gender) ?? t('completeYourProfile')}</Text>
              </Text>
          </View>
        </View>
      </View>
  )
}

export default PersonalInformation