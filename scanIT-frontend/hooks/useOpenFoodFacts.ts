import axios from "axios";
import { useState } from "react";

const useOpenFoodFacts = () => {
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState<any>(null);

    const getProduct = async (barcode: string) => {
        setLoading(true);
        setProduct(null);
        try{
            const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            setProduct(response.data.product);
            console.log(response.data.product);
        } catch(error){
            console.log(error);
        }
    }

    return { loading, getProduct, product };
};

export default useOpenFoodFacts