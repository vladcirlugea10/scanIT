import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types/StackParamsList';
import { colors } from '@/assets/colors';
import MyButton from '@/components/MyButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SelectBox from '@/components/SelectBox';
import { calculateDays, formatDateToString } from '@/utils/date';
import { AllergenGroups } from '@/types/AllergenIngredient';
import useUser from '@/hooks/useUser';

const Profile = () => {
  const { isAuth, user, onLogout, token } = useAuth();
  const { addAllergy, loading, error, getUserData, editUser, removeAllergy } = useUser(token);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [showSelectBox, setShowSelectBox] = useState(false);
  const [selectedAllergy, setSelectedAllergy] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    userName: user?.userName || '',
    email: user?.email || '',
    height: user?.height?.toString() || '0',
    weight: user?.weight?.toString() || '0',
  });

  useEffect(() => {
    if(!isAuth){
      navigation.navigate('Auth');
    }
  }, [isAuth]);

  useEffect(() => {
      getUserData();
  }, []);

  if(!isAuth){
    return null;
  }

  const handleLogout = async () => {
    if(onLogout){
      await onLogout();
      navigation.navigate("Home");
    }
  }

  const handleAddAllergy = async () => {
    if(selectedAllergy){
      try{
          await addAllergy(selectedAllergy);
          setShowSelectBox(false);
          setSelectedAllergy('');
      } catch(error){
          console.log('Error adding allergy: ', error);
      }
    }
  }

  const handleRemoveAllergy = async (allergy: string) => {
    if(allergy){
      try{
          await removeAllergy(allergy);
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
      height: user?.height?.toString() || '0',
      weight: user?.weight?.toString() || '0',
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

  const showAlert = () => {
    if(error){
      Alert.alert(
        'Error!',
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
      <Text style={styles.title}>Personal information</Text>
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
            <Text style={styles.subtitle}>Name: </Text>
            <TextInput style={dynamicStyles.input} editable={isEditing} value={editedUser.firstName} onChangeText={(text) => setEditedUser((prev) => ({...prev, firstName: text}))} />
            { editedUser.lastName ? (<TextInput style={dynamicStyles.input} editable={isEditing} value={editedUser.lastName} onChangeText={(text) => setEditedUser((prev) => ({...prev, lastName: text}))} />) :
              isEditing ? (<TextInput style={dynamicStyles.input} editable={isEditing} value='' onChangeText={(text) => setEditedUser((prev) => ({...prev, lastName: text}))}  />) : null
            }
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.subtitle}>Username: </Text>
            <TextInput style={dynamicStyles.input} editable={isEditing} value={editedUser.userName} onChangeText={(text) => setEditedUser((prev) => ({...prev, userName: text}))} />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.subtitle}>Email: </Text>
            <TextInput style={dynamicStyles.input} editable={isEditing} value={editedUser.email} onChangeText={(text) => setEditedUser((prev) => ({...prev, email: text}))} />
          </View>
          <Text style={{marginBottom: '5%'}}>
            <Text style={styles.subtitle}>Member since: </Text>
            <Text style={styles.text}>{ user?.createdAt ? formatDateToString(new Date(user?.createdAt)) : ''} ({calculateDays(user?.createdAt)} days)</Text>
          </Text>
          <View style={styles.allergiesContainer}>
            <View style={styles.allergiesTitle}> 
                <Text style={styles.subtitle}>Allergies: </Text>
                <TouchableOpacity>
                    { showSelectBox ? <MaterialCommunityIcons name='minus-box' size={24} color={colors.third} onPress={handleSelectBox} /> : <MaterialCommunityIcons name='plus-box' size={24} color={colors.third} onPress={handleSelectBox} /> }
                </TouchableOpacity>
                { showSelectBox && 
                    <View style={{position: 'absolute', display: 'flex', right: 0, flexDirection: 'row', gap: 10}}>
                        <SelectBox style={{zIndex: 100, width: 130}} title='Select an allergy' options={AllergenGroups} selectedOption={selectedAllergy} setSelectedOption={setSelectedAllergy} />
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
              )) : <Text style={{marginLeft: '5%'}} >You don't have any alleries!</Text>
            }
          </View>
          <View style={{display: 'flex', flexDirection: 'row', gap: "10%"}}>
            <View style={styles.infoContainerRow}>
              <Text style={styles.subtitle}>Height(cm): </Text>
              <TextInput style={dynamicStyles.input} editable={isEditing} value={ editedUser.height ? editedUser.height : '0'} keyboardType='numeric' onChangeText={(text) => setEditedUser((prev) => ({...prev, height: text}))} />
            </View>
            <View style={styles.infoContainerRow}>
              <Text style={styles.subtitle}>Weight(kg): </Text>
              <TextInput style={dynamicStyles.input} editable={isEditing} value={ editedUser.weight ? editedUser.weight : '0'} keyboardType='numeric' onChangeText={(text) => setEditedUser((prev) => ({...prev, weight: text}))} />
            </View>
          </View>
        </View>
        <Text style={styles.title}>Your activity: </Text>
      </View>
      <MyButton title='Logout' onPress={handleLogout} containerStyle={{backgroundColor: colors.danger, marginTop: "5%"}} />
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
    right: 15,
    top: 10,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
});

export default Profile