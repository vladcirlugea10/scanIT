import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '@/assets/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/StackParamsList';

const BackButton = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute();
    return (
      <View style={{ backgroundColor: colors.third, height: 70, justifyContent: 'center' }}>
        <TouchableOpacity onPress={() => route.name === 'Profile' ? navigation.navigate("Home") : navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name='chevron-back' size={24} color={colors.secondary} />
        </TouchableOpacity>
      </View>
    );
};

export default BackButton