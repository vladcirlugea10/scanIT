import axios from "axios";
import { useCallback, useState } from "react"
import { useAuth } from "./useAuth";
import { UpdateData } from "@/types/UserType";

const useUser = (token: string | null | undefined) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { user, updateUserData } = useAuth();

    const localIP = "192.168.1.7";

    const clearError = () => setError(null);

    const getUserData = useCallback(async () => {
        if(!user?.email || !token){
            setError("User not found");
            return;
        }
        try{
            setLoading(true);
            clearError();

            const response = await axios.get(`http://${localIP}:5000/api/user/${user.email}`, {
                headers: {
                    'Token': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            updateUserData(response.data);
            setLoading(false);
        } catch(error: any){
            const errorMessage = error.response.data.message || error.message || "Error getting user data";
            setError(errorMessage);
            setLoading(false);
        }
    }, [user?.email, token, updateUserData]);

    const editUser = async (userData: UpdateData) => {
        if(!user?._id || !token){
            setError("User not found");
            console.log('User not found');
            return;
        }
        try{
            setLoading(true);
            clearError();

            const response = await axios.put(`http://${localIP}:5000/api/user/edit/${user._id}`, userData, {
                headers: {
                    'Token': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            await getUserData();
            setLoading(false);
        } catch(error: any){
            const errorMessage = error.response.data.message || error.message || "Error updating user data";
            setError(errorMessage);
            setLoading(false);
        }
    }

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
            const errorMessage = error.response.data.message || error.message || "Error adding allergy";
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
            const errorMessage = error.response.data.message || error.message || "Error removing allergy";
            setError(errorMessage);
            setLoading(false);
            throw error;
        }
    }

    return { error, loading, addAllergy, getUserData, removeAllergy, editUser };
};

export default useUser;