import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '@/assets/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const BackButton = () => {
    const navigation = useNavigation();
    return (
      <View style={{ backgroundColor: colors.third, height: 70, justifyContent: 'center' }}>
        <TouchableOpacity onPress={() => {navigation.goBack(); console.log("press");}} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name='chevron-back' size={24} color={colors.secondary} />
        </TouchableOpacity>
      </View>
    );
};

export default BackButton