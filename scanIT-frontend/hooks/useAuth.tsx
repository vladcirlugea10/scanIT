import { LoginData, RegisterData } from "@/types/UserType";
import { createContext, useContext, useState } from "react";

interface AuthContextType {
    token?: string | null;
    isAuth?: boolean | null;
    onLogin?: (loginData: LoginData) => Promise<any>;
    onRegister?: (registerData: RegisterData) => Promise<any>;
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

    const onRegister = async (registerData: RegisterData) => {
        try {

        }catch(error){
            
        }
    }
}