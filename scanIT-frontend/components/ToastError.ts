import Toast from 'react-native-toast-message';

export const toastError = (text: string) => {
    Toast.show({
        type: 'error',
        text1: "Error!",
        text2: text,
        visibilityTime: 3000,
        autoHide: true,
    })
}