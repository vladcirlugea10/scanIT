import { View, Text, Modal, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import MyButton from './MyButton';
import { useTheme } from '@/app/ColorThemeContext';
import { createGlobalStyles } from '@/assets/styles';

interface BarcodeModalProps {
    visible: boolean;
    onClose: () => void;
    onPressSubmit: (barcode: string) => void;
}

const BarcodeModal: React.FC<BarcodeModalProps> = ({visible, onClose, onPressSubmit}) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    
    const globalStyles = createGlobalStyles(colors);
    const [barcode, setBarcode] = useState<string>('');

    const styles = StyleSheet.create({
        input:{
            borderWidth: 1,
            borderColor: colors.third,
        }
    })

    return (
        <Modal visible={visible} transparent={true} animationType='slide'>
            <View style={globalStyles.modalContainer}>
                <View style={globalStyles.modalContent}>
                    <Text>{t("enterBarcode")}</Text>
                    <TextInput style={styles.input} keyboardType='numeric' placeholder={t("barcode")} onChangeText={(text) => setBarcode(text)} ></TextInput>
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                        <MyButton title={t("submit")} onPress={() => onPressSubmit(barcode)} />
                        <MyButton title={t("close")} onPress={onClose} />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default BarcodeModal