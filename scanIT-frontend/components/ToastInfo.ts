import Toast from 'react-native-toast-message';

export const toastInfo = (text: string) => {
    Toast.show({
        type: 'info',
        text1: 'Info',
        text2: text,
        visibilityTime: 5000,
        autoHide: true,
    })
};