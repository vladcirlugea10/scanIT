import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import { useAuth } from "./useAuth";
import { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
    const { onGoogleLogin } = useAuth();

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: Constants.expoConfig?.extra?.GOOGLE_CLIENT_ID_ANDROID,
        iosClientId: Constants.expoConfig?.extra?.GOOGLE_CLIENT_ID_IOS,
        scopes: ["profile", "email"],
    });

    useEffect(() => {
        const authWithGoogle = async () => {
            if(response?.type === "success"){
                const idToken = response.authentication?.idToken;
                if(idToken){
                    try{
                        await onGoogleLogin(idToken);
                    }catch(error){
                        console.log("Error on Google login: ", error);
                    }
                }
            }
        };
        authWithGoogle();
    }, [response, onGoogleLogin]);

    return { promptAsync, request };
}