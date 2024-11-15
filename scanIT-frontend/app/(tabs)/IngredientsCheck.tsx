import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '@/types/StackParamsList'
import { GetAllergenIngredient } from '@/types/AllergenIngredient';
import { getIngredientsAllergens, getIngredientsUnhealthy } from '@/database/local/sqLite';

type IngredientsCheckNavProps = { route: RouteProp<RootStackParamList, 'IngredientsCheck'> };

const IngredientsCheck: React.FC<IngredientsCheckNavProps> = ({route}) => {
    const { data } = route.params;
    const [foundIngredients, setFoundIngredients] = useState<GetAllergenIngredient[]>([]);

    useEffect(() => {
        handleCheckIngredients();
    }, [data]);

    const handleCheckIngredients = async () => {
        const allergens: GetAllergenIngredient[] = await getIngredientsAllergens();
        const unhealthy: GetAllergenIngredient[] = await getIngredientsUnhealthy();
        const found: GetAllergenIngredient[] = [];
  
        if(allergens.length > 0){
          allergens.map((ingredient) => {
            if(data.text.includes(ingredient.name)){
              found.push(ingredient);
            }
          })
        }
        if(unhealthy.length > 0){
          unhealthy.map((ingredient) => {
            if(data.text.includes(ingredient.name)){
              found.push(ingredient);
            }
          })
        }
        setFoundIngredients(found);
        console.log("aici",foundIngredients);
    }

    if(foundIngredients.length > 0){
        return(
          <View style={styles.mainContainer}>
            <Text style={{fontSize: 25, fontWeight: 700}}>
              Ingredients contain:
            </Text>
            <View style={styles.resultContainer}>
              {foundIngredients.map((ingredient, index) => {
                return(
                  <Text key={index} style={{fontSize: 16, color: 'red'}}>{ingredient.name}</Text>
                )
              })}
            </View>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
    },
    resultContainer:{
      width: '85%',
      height: '75%',
      padding: 16,
      borderTopWidth: 2,
      borderTopColor: 'black',
    },
});

export default IngredientsCheck