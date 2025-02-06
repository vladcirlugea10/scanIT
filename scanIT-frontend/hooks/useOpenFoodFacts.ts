import axios from "axios";
import { useState } from "react";

const useOpenFoodFacts = () => {
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);
    const [notFound, setNotFound] = useState(false);

    const getProduct = async (barcode: string) => {
        setLoading(true);
        setProduct(null);
        setNotFound(false);
        try{
            const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            const data = await response.data.status;

            if(data === 1){
                setProduct(response.data.product);
            }else{
                setProduct(null);
                setNotFound(true);
            }
        } catch(error){
            console.log(error);
            setNotFound(true);
        }
        setLoading(false);
    }

    return { loading, getProduct, product, notFound };
};

export default useOpenFoodFacts