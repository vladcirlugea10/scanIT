import axios from "axios";
import { LoginData, RegisterData, UserData } from "@/types/UserType";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import * as SecureStorage from "expo-secure-store";

interface AuthContextType {
    token?: string | null;
    isAuth?: boolean | null;
    user?: UserData | null;
    error?: string | null;
    loading?: boolean;
    clearError: () => void;
    onLogin: (loginData: LoginData) => Promise<any>;
    onRegister: (registerData: RegisterData) => Promise<boolean>;
    onLogout?: () => void;
    forgotPassword: (email: string) => Promise<any>;
    checkResetCode: (resetCode: string) => Promise<any>;
    changePassword: ({email, password, confirmPassword} : {email: string, password: string, confirmPassword: string}) => Promise<any>;
    updateUserData: (userData: UserData) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }
    return authContext;
}

export const AuthProvider = ({children}: any) => {
    const [token, setToken] = useState<string | null>(null);
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const [user, setUser] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const localIP = "192.168.1.102"; // Change this to your local IP

    useEffect(() => {
        loadToken();
    }, []);

    const clearError = () => setError(null);

    const checkTokenExpiration = (token: string) => {
        try{
            const decodedToken: any = jwtDecode(token);
            return decodedToken.exp * 1000 > Date.now();
        } catch(error){
            console.log("Error on checkTokenExpiration: ", error);
            throw error;
        }
    }   

    const saveToken = async (newToken: string) => {
        try{
            await SecureStorage.setItemAsync("token", newToken);
        }catch(error){
            console.log("Error on saveToken: ", error);
            throw error;
        }
    }

    const loadToken = async () => {
        try{
            const loadedToken = await SecureStorage.getItemAsync("token");
            if(loadedToken && checkTokenExpiration(loadedToken)){
                setToken(loadedToken);
                decodeToken(loadedToken);
                setIsAuth(true);
            }
        }catch(error){
            console.log("Error on loadToken: ", error);
            setIsAuth(false);
            throw error;
        }
    }

    const decodeToken = (newToken: string) => {
        try{
            const decodedUser: UserData = jwtDecode(newToken);
            setUser(decodedUser); 
        }catch(error){
            console.log("Error on decodeToken: ", error);
            setUser(null);
            throw error;
        }
    }

    const onRegister = async (registerData: RegisterData): Promise<boolean> => {
        try {
            setLoading(true);
            clearError();
            const response = await axios.post(`http://${localIP}:5000/api/auth/register`, registerData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("Response: ", response.data);

            const newToken = response.data.token;
            if(!newToken){
                throw new Error("Token not found");
            }
            setToken(newToken);
            await saveToken(newToken);
            setIsAuth(true);
            setLoading(false);

            return true;
        }catch(error: any){
            console.log("Error on register: " ,error);
            const errorMessage = error.response?.data?.message || error.message || 'An error ocurred on register';
            setError(errorMessage);
            setLoading(false);
            throw error;
        }
    };

    const onLogin = async (loginData: LoginData): Promise<any> => {
        try{
            setLoading(true);
            clearError();
            const response = await axios.post(`http://${localIP}:5000/api/auth/login`, loginData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("Response: ", response.data);
            const newToken = response.data.token;
            if(!newToken){
                throw new Error("Token not found");
            }
            decodeToken(newToken);
            setToken(newToken);
            await saveToken(newToken);
            setIsAuth(true);
            setLoading(false);

            return true;
        }catch(error: any){
            console.log("Error on login: ", error);
            const errorMessage = error.response?.data?.message || error.message || 'An error ocurred on login';
            setError(errorMessage);
            setLoading(false);
            throw error;
        }
    }

    const onLogout = async () => {
        try{
            await SecureStorage.deleteItemAsync("token");
            console.log("Token deleted");
            axios.defaults.headers.common["Authorization"] = "";
            setToken(null);
            setIsAuth(false);
            setUser(null);
        } catch(error){
            console.log("Error on logout: ", error);
            throw error;
        }
    }

    const forgotPassword = async (email: string) => {
        try{
            setLoading(true);
            const response = await axios.post(`http://${localIP}:5000/api/user/forgot-password`, { email }, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            setLoading(false);
            return response.data;
        }catch(error: any){
            console.log("Error on forgotPassword: ", error);
            setError(error.response?.data?.message || error.message || 'An error ocurred while sending the email');
            setLoading(false);
            throw error;
        }
    }

    const checkResetCode = async (resetCode: string) => {
        try{
            setLoading(true);
            const response = await axios.post(`http://${localIP}:5000/api/user/check-code`, { resetCode }, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            setLoading(false);
            return response.data;
        }catch(error: any){
            console.log("Error on checkResetCode: ", error);
            setLoading(false);
            setError(error.response?.data?.message || error.message || 'An error ocurred while checking the code');
            throw error;
        }
    }

    const changePassword = async ({email, password, confirmPassword} : {email: string, password: string, confirmPassword: string}) => {
        try{
            setLoading(true);
            const response = await axios.put(`http://${localIP}:5000/api/user/change-password`, { email, newPassword: password, confirmNewPassword: confirmPassword }, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            setLoading(false);
            return response.data;
        }catch(error: any){
            console.log("Error on changePassword: ", error);
            setLoading(false);
            const errorMessage = error.response?.data?.message || error.message || 'An error ocurred on change password';
            setError(errorMessage);
            throw error;
        }
    }

    const updateUserData = (userData: UserData) => {
        setUser(userData);
    }

    return(<AuthContext.Provider value={{
        token,
        isAuth,
        user,
        error,
        loading,
        clearError,
        onRegister,
        onLogin,
        onLogout,
        forgotPassword,
        checkResetCode,
        changePassword,
        updateUserData,
    }}>
        {children}
        </AuthContext.Provider>
    );

}