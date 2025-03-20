import { useState } from "react"
import axios from "axios"
import Image from "@/types/Image";
import OCRResult from "@/types/OCRTypes";
import { _post } from "@/utils/api";

const useImageOCR = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<OCRResult>({text: []});

    const URL = "https://e0a1-84-232-135-16.ngrok-free.app";

    const scanImage = async (image: Image) => {
        setLoading(true);
        setData({text: []});

        try{
            const formData = new FormData();
            formData.append('image', {
                uri: image.uri,
                type: 'image/jpg',
                name: 'image.jpg',
            });
            
            const response = await axios.post(`${URL}/ocr`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 20000,
            });
            setData(response.data);
        } catch(error){
            console.log(error);
        } finally{
            setLoading(false);
        }
    };

    return { loading, scanImage, data };
};

export default useImageOCR