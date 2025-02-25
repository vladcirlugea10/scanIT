import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '@/types/StackParamsList'
import { GetAllergenIngredient } from '@/types/AllergenIngredient';
import { getIngredientsAllergens, getIngredientsUnhealthy } from '@/database/local/sqLite';
import { Ionicons } from '@expo/vector-icons';
import IngredientModal from '../../components/IngredientModal';
import MyButton from '@/components/MyButton';
import { useTheme } from '../ColorThemeContext';

type IngredientsCheckNavProps = { route: RouteProp<RootStackParamList, 'IngredientsCheck'> };

const IngredientsCheck: React.FC<IngredientsCheckNavProps> = ({route}) => {
    const { data } = route.params;
    const { colors } = useTheme();
    const [foundAllergenIngredients, setFoundAllergenIngredients] = useState<GetAllergenIngredient[]>([]);
    const [foundUnhealthyIngredients, setFoundUnhealthyIngredients] = useState<GetAllergenIngredient[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState<GetAllergenIngredient | null>(null);

    const styles = StyleSheet.create({
      mainContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        backgroundColor: colors.secondary,
      },
      resultContainer:{
        width: '85%',
        height: '90%',
        padding: 8,
      },
      allergenContainer: {
        width: '100%',
        height: '50%',
        gap: 8,
      },
      subtitle: {
       fontSize: 25, 
       borderBottomWidth: 2, 
       borderTopColor: 'black',
      }
  });

    useEffect(() => {
        handleCheckIngredients();
    }, [data]);

    const handleOpenModal = (ingredient: GetAllergenIngredient) => {
        setSelectedIngredient(ingredient);
        setModalVisible(true);
    }

    const handleCloseModal = () => {
        setSelectedIngredient(null);
        setModalVisible(false);
    }

    const handleCheckIngredients = async () => {
        const allergens: GetAllergenIngredient[] = await getIngredientsAllergens();
        const unhealthy: GetAllergenIngredient[] = await getIngredientsUnhealthy();
        const foundAllergen: GetAllergenIngredient[] = [];
        const foundUnhealthy: GetAllergenIngredient[] = [];
  
        if(allergens.length > 0){
          allergens.map((ingredient) => {
            if(data.text.includes(ingredient.name)){
              foundAllergen.push(ingredient);
            }
          })
        }
        if(unhealthy.length > 0){
          unhealthy.map((ingredient) => {
            if(data.text.includes(ingredient.name)){
              foundUnhealthy.push(ingredient);
            }
          })
        }
        setFoundAllergenIngredients(foundAllergen);
        setFoundUnhealthyIngredients(foundUnhealthy);
        console.log("aici",foundAllergenIngredients);
        console.log("aici",foundUnhealthyIngredients);
    }

    if(foundAllergenIngredients.length === 0 && foundUnhealthyIngredients.length === 0){
        return(
          <View style={styles.mainContainer}>
            <Text style={{fontSize: 25, fontWeight: 700}}>No bad ingredients found!</Text>
            <Ionicons name='checkmark-circle-outline' size={50} color={colors.success} />
          </View>
        )
    }

    if(foundAllergenIngredients.length > 0 || foundUnhealthyIngredients.length > 0){
        return(
          <View style={styles.mainContainer}>
            <View style={styles.resultContainer}>
              <View style={styles.allergenContainer}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons name='warning-outline' size={40} color={colors.danger} />
                  <Text style={styles.subtitle}>Allergen Ingredients:</Text>
                </View>
                {foundAllergenIngredients.length > 0 ? foundAllergenIngredients.map((ingredient) => (
                  <View key={ingredient.id} style={{flexDirection: 'row', alignContent: "center"}}>
                    <Text style={{color: colors.danger}} key={ingredient.id}>{ingredient.name}({ingredient.group})</Text>
                    <MyButton title='' onPress={() => handleOpenModal(ingredient)} containerStyle={{justifyContent: "center", alignItems: "center", width: 40, height: 40, backgroundColor: colors.secondary}} iconName='add-outline' iconSize={15} iconColor={colors.danger} />
                  </View>
                ))
                : (
                  <Text>No allergen ingredients found!</Text>
                )}
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons name='alert-circle-outline' size={40} color={colors.warning} />
                  <Text style={styles.subtitle}>Unhealthy Ingredients:</Text>
              </View>
              {foundUnhealthyIngredients.length > 0 ? foundUnhealthyIngredients.map((ingredient) => (
                <View key={ingredient.id} style={{flexDirection: 'column'}}>
                  <Text style={{color: colors.warning}} key={ingredient.id}>{ingredient.name}({ingredient.group})</Text>
                </View>
              )) 
              : 
                <Text>No unhealthy ingredients found!</Text>
              }
            </View>
            <IngredientModal visible={modalVisible} onClose={handleCloseModal} ingredient={selectedIngredient} />
          </View>
        )
    }
}

export default IngredientsCheck