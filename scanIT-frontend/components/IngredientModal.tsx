import { View, Text, Modal, StyleSheet } from 'react-native'
import React from 'react'
import MyButton from '@/components/MyButton';
import { useTheme } from '@/app/ColorThemeContext';

interface IngredientModalProps {
    visible: boolean;
    onClose: () => void;
    ingredient: {
        name: string;
        group: string;
        description: string;
    } | null;
}

const IngredientModal: React.FC<IngredientModalProps> = ({visible, onClose, ingredient}) => {
    const { colors } = useTheme();
    const styles = StyleSheet.create({
        modalContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
          width: '80%',
          padding: 20,
          backgroundColor: 'white',
          borderRadius: 10,
        },
      });

    if (!ingredient) return null;
    return (
        <Modal visible={visible} transparent={true} animationType='slide'>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text>Name: {ingredient.name}</Text>
                    <Text>Group: {ingredient.group}</Text>
                    <Text>Description: {ingredient.description}</Text>
                    <MyButton title='Close' onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

export default IngredientModal