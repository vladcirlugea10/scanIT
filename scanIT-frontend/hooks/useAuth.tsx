import axios from "axios";
import { LoginData, RegisterData, UserData } from "@/types/UserType";
import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
    token?: string | null;
    isAuth?: boolean | null;
    user?: UserData | null;
    onLogin: (loginData: LoginData) => Promise<any>;
    onRegister: (registerData: RegisterData) => Promise<boolean>;
    onLogout?: () => Promise<void>;
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

    const decodeToken = (newToken: string) => {
        try{
            const decodedUser: UserData = jwtDecode(newToken);
            setUser(decodedUser); 
            console.log("Decoded user: ", decodedUser);
        }catch(error){
            console.log("Error on decodeToken: ", error);
            setUser(null);
            throw error;
        }
    }

    const onRegister = async (registerData: RegisterData): Promise<boolean> => {
        try {
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
            setIsAuth(true);

            return true;
        }catch(error){
            console.log("Error on register: " ,error);
            throw error;
        }
    };

    const onLogin = async (loginData: LoginData): Promise<any> => {
        try{
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
            setIsAuth(true);

            return true;
        }catch(error){
            console.log("Error on login: ", error);
            throw error;
        }
    }

    return(<AuthContext.Provider value={{
        token,
        isAuth,
        user,
        onRegister,
        onLogin,
    }}>
        {children}
        </AuthContext.Provider>
    );

}