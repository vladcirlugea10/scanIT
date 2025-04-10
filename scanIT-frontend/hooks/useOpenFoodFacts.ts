import { _get, _post } from "@/utils/api";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import * as SecureStore from 'expo-secure-store';
import countryMap from "@/assets/data/countries";

const useOpenFoodFacts = () => {
    const { token } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [barcode, setBarcode] = useState("");
    const [country, setCountry] = useState("");

    const clearError = () => setError(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if(!barcode){
                return;
            }
            const selectedCountry = await SecureStore.getItemAsync('selectedCountry');
            const countryCode = selectedCountry ? countryMap[selectedCountry] : country ? Object.keys(countryMap) : 'world';
            console.log("Selected country code: ", countryCode);
            setLoading(true);
            clearError();
            setProduct(null);
            setNotFound(false);
            try{
                const response = await axios.get(`https://${countryCode}.openfoodfacts.net/api/v2/product/${barcode}`);
                const data = await response.data.status;
    
                if(data === 1){
                    setProduct(response.data.product);
                    setNotFound(false);
                }else{
                    setProduct(null);
                    setNotFound(true);
                }
            } catch(error){
                console.log(error);
                setNotFound(true);
                setProduct(null);
                return { notFound: true };
            } finally{
                setLoading(false);
            }
        };
        fetchProduct();
    }, [barcode]);

    const getProduct = async (barcode: string, country?: string) => {
        setBarcode(barcode);
        setCountry(country || "");

        return new Promise<void>((resolve) => {
            setTimeout(() => {
                const checkStatus = () => {
                    if(!loading){
                        resolve();
                    }else{
                        setTimeout(checkStatus, 200);
                    }
                };
                checkStatus();
            }, 0);
        });
    };

    const addProduct = async (product: AddProduct) => {
        if(!product){
            return;
        }
        console.log("barcode",product.barcode);

        setLoading(true);
        clearError();
        try{
            const response = await _post('/open-food-facts/add-new-product', product, { headers: { 'Token': `Bearer ${token}` }});
            const data = await response.data;
            return data;
        } catch(error: any){
            const errorMessage = error.response.data.message || error.message || "Error adding new product";
            setError(errorMessage);
            throw error;
        } finally{
            setLoading(false);
        }
    }

    const addImage = async (image: string, barcode: string, imagefield: string) => {
        if(!image || !barcode || !imagefield){
            return;
        }
        console.log(`Uploading ${imagefield} image for barcode: ${barcode}`);
        const formData = new FormData();
        const filename = image.split('/').pop() || `image_${Date.now()}.jpg`;
        const fileType = filename.split('.').pop() || 'jpg';

        formData.append('barcode', barcode);
        formData.append('imagefield', imagefield);
        formData.append('image', {
            uri: image,
            name: filename,
            type: `image/${fileType}`,
        } as any);

        setLoading(true);
        clearError();
        try {
            const response = await axios.post(`http://192.168.1.3:5000/api/open-food-facts/add-product-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Token': `Bearer ${token}`
                }
            });
            const data = await response.data;
            return data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Error adding image";
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const editProduct = async (product: EditProduct) => {
        if(!product){
            return;
        }

        setLoading(true);
        clearError();
        try{
            const response = await _post('/open-food-facts/edit-product', product, { headers: { 'Token': `Bearer ${token}` }});
            const data = await response.data;
            return data;
        } catch(error: any){
            const errorMessage = error.response.data.message || error.message || "Error editing product";
            setError(errorMessage);
            throw error;
        } finally{
            setLoading(false);
        }  
    }

    return { loading, error, getProduct, product, notFound, addProduct, editProduct, addImage };
};

export default useOpenFoodFacts