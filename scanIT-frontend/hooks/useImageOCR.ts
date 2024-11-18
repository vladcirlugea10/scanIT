import { useState } from "react"
import axios from "axios"
import Image from "@/types/Image";
import OCRResult from "@/types/OCRTypes";
import { getExpoServerIP } from "@/utils/expo_server";

const useImageOCR = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<OCRResult>({text: []});

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
            
            const serverIP = getExpoServerIP();
            const response = await axios.post(`http://${serverIP}:5000/api/ocr`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
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