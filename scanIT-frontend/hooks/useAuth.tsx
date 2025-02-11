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
    clearError: () => void;
    onLogin: (loginData: LoginData) => Promise<any>;
    onRegister: (registerData: RegisterData) => Promise<boolean>;
    onLogout?: () => void;
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

    useEffect(() => {
        loadToken();
    }, []);

    const clearError = () => setError(null);

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
            if(loadedToken){
                setToken(loadedToken);
                decodeToken(loadedToken);
                setIsAuth(true);
            }
        }catch(error){
            console.log("Error on loadToken: ", error);
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
            clearError();
            const response = await axios.post("http://192.168.1.5:5000/api/auth/register", registerData, {
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

            return true;
        }catch(error: any){
            console.log("Error on register: " ,error);
            const errorMessage = error.response?.data?.message || error.message || 'An error ocurred on register';
            setError(errorMessage);
            throw error;
        }
    };

    const onLogin = async (loginData: LoginData): Promise<any> => {
        try{
            clearError();
            const response = await axios.post("http://192.168.1.5:5000/api/auth/login", loginData, {
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

            return true;
        }catch(error: any){
            console.log("Error on login: ", error);
            const errorMessage = error.response?.data?.message || error.message || 'An error ocurred on login';
            setError(errorMessage);
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

    return(<AuthContext.Provider value={{
        token,
        isAuth,
        user,
        error,
        clearError,
        onRegister,
        onLogin,
        onLogout,
    }}>
        {children}
        </AuthContext.Provider>
    );

}