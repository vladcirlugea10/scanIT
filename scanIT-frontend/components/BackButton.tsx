import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { colors } from '@/assets/colors';
import { Ionicons } from '@expo/vector-icons';

const BackButton = () => {
    const navigation = useNavigation();
    return (
      <View style={{ backgroundColor: colors.third, height: 80, justifyContent: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name='chevron-back' size={24} color={colors.secondary} />
        </TouchableOpacity>
      </View>
    );
  };

export default BackButton