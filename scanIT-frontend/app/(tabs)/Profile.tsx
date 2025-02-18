import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
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
  const { addAllergy, loading, error } = useUser(token);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [showSelectBox, setShowSelectBox] = useState(false);
  const [selectedAllergy, setSelectedAllergy] = useState('');

  useEffect(() => {
    if(!isAuth){
      navigation.navigate('Auth');
    }
  }, [isAuth]);

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
      await addAllergy(selectedAllergy);
      setShowSelectBox(false);
      setSelectedAllergy('');
    }
  }

  const handleEditProfile = () => {
    console.log('Edit profile');
  }

  const handleSelectBox = () => {
    setShowSelectBox(!showSelectBox);
  }

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Personal information</Text>
      <View style={styles.dataContainer}>
        <View style={styles.personalDataContainer}>
          <Text>
            <Text style={styles.subtitle}>Name: </Text>
            <Text style={styles.text}>{user?.firstName} {user?.lastName}</Text>
          </Text>
          <Text>
            <Text style={styles.subtitle}>Username: </Text>
            <Text style={styles.text}>{user?.userName}</Text>
          </Text>
          <Text>
            <Text style={styles.subtitle}>Email: </Text>
            <Text style={styles.text}>{user?.email}</Text>
          </Text>
          <Text>
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
                <Text style={{marginLeft: '5%'}} key={index}>{allergy}</Text>
              )) : <Text style={{marginLeft: '5%'}} >You don't have any alleries!</Text>
            }
          </View>
          <View style={styles.allergiesTitle}>
            <Text>
              <Text style={styles.subtitle}>Height: </Text>
              <Text style={styles.text}>{user?.height} cm</Text>
            </Text>
            <Text>
              <Text style={styles.subtitle}>Weight: </Text>
              <Text style={styles.text}>{user?.weight} kg</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile} >
              <MaterialCommunityIcons name='pencil-circle' size={48} color={colors.primary} />
          </TouchableOpacity>
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
  },
  dataContainer:{
    width: '90%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    marginTop: '5%',
  },
  personalDataContainer:{
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    width: '100%',
  },
  allergiesContainer:{
    display: 'flex',
    flexDirection: 'column',
  },
  allergiesTitle:{
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '5%',
    gap: 20,
  },
  editButton:{
    position: 'absolute',
    right: 0,
    bottom: 0,
  }
});

export default Profile