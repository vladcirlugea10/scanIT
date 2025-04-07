import { View, Text, Modal } from 'react-native'
import React from 'react'
import MyButton from '@/components/MyButton';
import { useTheme } from '@/app/ColorThemeContext';
import { useTranslation } from 'react-i18next';
import { createGlobalStyles } from '@/assets/styles';

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
    const { t } = useTranslation();
    
    const globalStyles = createGlobalStyles(colors);

    if (!ingredient) return null;
    return (
        <Modal visible={visible} transparent={true} animationType='slide'>
            <View style={globalStyles.modalContainer}>
                <View style={globalStyles.modalContent}>
                    <View style={[globalStyles.horizontalInputContainer, {alignItems: "baseline"}] }>
                        <Text style={globalStyles.subtitle}>{t("name")}:</Text>
                        <Text>{ingredient.name}</Text>
                    </View>
                    <View style={[globalStyles.horizontalInputContainer, {alignItems: "baseline"}] }>
                        <Text style={globalStyles.subtitle}>{t("group")}:</Text>
                        <Text>{ingredient.group}</Text>
                    </View>
                    <View style={[globalStyles.horizontalInputContainer, {alignItems: "baseline"}] }>
                        <Text style={globalStyles.subtitle}>{t("description")}:</Text>
                        <Text>{ingredient.description}</Text>
                    </View>
                    <MyButton title={t("close")} onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

export default IngredientModal