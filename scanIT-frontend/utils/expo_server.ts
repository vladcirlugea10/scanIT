import Constants from "expo-constants"

export const getExpoServerIP = () => {
    const { expoConfig } = Constants;
    return expoConfig?.hostUri?.split(":")[0];
}