import axios from "axios";
import { useCallback, useEffect, useState } from "react"
import { useAuth } from "./useAuth";

const useUser = (token: string | null | undefined) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { user, updateUserData } = useAuth();

    const localIP = "192.168.1.5";

    const clearError = () => setError(null);

    const getUserData = useCallback(async () => {
        if(!user?.email || !token){
            setError("User not found");
            return;
        }
        console.log(user.email);
        try{
            setLoading(true);
            clearError();

            const response = await axios.get(`http://${localIP}:5000/api/user/${user.email}`, {
                headers: {
                    'Token': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(response.data);
            updateUserData(response.data);
            setLoading(false);
        } catch(error: any){
            const errorMessage = error.message || "Error getting user data";
            setError(errorMessage);
            setLoading(false);
        }
    }, [user?.email, token, updateUserData]);

    const addAllergy = async (allergy: string) => {
        if(!user?.email){
            setError("User not found");
            return;
        }
        try{
            setLoading(true);
            clearError();

            const response = await axios.put(`http://${localIP}:5000/api/user/add-allergy`, {email: user.email, allergy}, {
                headers: {
                    'Token': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            await getUserData();
            console.log(response.data);
            setLoading(false);
            return response.data;
        } catch(error: any){
            const errorMessage = error.message || "Error adding allergy";
            setError(errorMessage);
            setLoading(false);
            throw error;
        }
    }   

    const removeAllergy = async (allergy: string) => {
        setLoading(true);
        clearError();
        try{
            const response = await axios.delete(`http://${localIP}:5000/api/user/remove-allergy`, {
                headers: {
                    'Token': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                data: { email: user?.email, allergy }
            });
            await getUserData();
            setLoading(false);
            return response.data;
        }catch(error: any){
            const errorMessage = error.message || "Error removing allergy";
            setError(errorMessage);
            setLoading(false);
            throw error;
        }
    }

    return { error, loading, addAllergy, getUserData, removeAllergy };
};

export default useUser;