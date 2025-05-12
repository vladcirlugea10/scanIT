import Toast from 'react-native-toast-message';

export const toastSuccess = (text: string) => {
    Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: text,
        visibilityTime: 3000,
        autoHide: true,
    })
};