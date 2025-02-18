import axios from "axios";
import { useEffect, useState } from "react"
import { useAuth } from "./useAuth";

const useUser = (token: string | null | undefined) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const localIP = "192.168.1.5";

    const clearError = () => setError(null);

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
            console.log(response.data);
            setLoading(false);

        } catch(error: any){
            const errorMessage = error.message || "Error adding allergy";
            setError(errorMessage);
            setLoading(false);
        }
    }   

    return { error, loading, addAllergy };
};

export default useUser;