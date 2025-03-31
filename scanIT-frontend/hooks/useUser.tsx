import { useCallback, useState } from "react"
import { useAuth } from "./useAuth";
import { UpdateData } from "@/types/UserType";
import { _delete, _get, _put } from "@/utils/api";

const useUser = (token: string | null | undefined) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { user, updateUserData } = useAuth();

    const clearError = () => setError(null);

    const getUserData = useCallback(async () => {
        if(!user?.email || !token){
            setError("User not found");
            return;
        }
        try{
            setLoading(true);
            clearError();

            const response = await _get(`/user/${user.email}`, { headers: { 'Token': `Bearer ${token}` } });
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

            const response = await _put(`/user/edit/${user._id}`, userData, { headers: { 'Token': `Bearer ${token}` }});
            console.log(response.data);
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

            const response = await _put('/user/add-allergy', { email: user.email, allergy }, { headers: { 'Token': `Bearer ${token}` }}); 

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
            const response = await _delete('/user/remove-allergy', { email: user?.email, allergy }, { headers: { 'Token': `Bearer ${token}` }});
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

    const addProduct = async (product: ScannedProduct) => {
        setLoading(true);
        clearError();
        try{
            const response = await _put('/user/add-scanned-product', { email: user?.email, product }, { headers: { 'Token': `Bearer ${token}` }});
            await getUserData();
            setLoading(false);
            return response.data;
        }catch(error: any){
            const errorMessage = error.response.data.message || error.message || "Error adding product";
            setError(errorMessage);
            setLoading(false);
            throw error;
        }
    }

    const addNewProduct = async (barcode: string) => {
        setLoading(true);
        clearError();
        try{
            const response = await _put('/user/add-new-product', { email: user?.email, barcode: barcode }, { headers: { 'Token': `Bearer ${token}` }});
            await getUserData();
            setLoading(false);
            return response.data;
        }catch(error: any){
            const errorMessage = error.response.data.message || error.message || "Error adding new product";
            setError(errorMessage);
            setLoading(false);
            throw error;
        }
    }

    const addEditedProduct = async (barcode: string) => {
        setLoading(true);
        console.log("in hook:", barcode);
        clearError();
        try{
            const response = await _put('/user/add-edited-product', { email: user?.email, barcode: barcode }, { headers: { 'Token': `Bearer ${token}` }});
            await getUserData();
            setLoading(false);
            return response.data;
        }catch(error: any){
            const errorMessage = error.response.data.message || error.message || "Error adding edited product";
            setError(errorMessage);
            setLoading(false);
            throw error;
        }
    }

    return { error, loading, addAllergy, getUserData, removeAllergy, editUser, addProduct, addNewProduct, addEditedProduct };
};

export default useUser;