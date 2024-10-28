import { useState } from "react"
import axios from "axios"

const useImageOCR = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const scanImage = async (image) => {
        setLoading(true);
        setData(null);

        try{
            const formData = new FormData();
            formData.append('image', {
                uri: image.uri,
                type: 'image/jpg',
                name: 'image.jpg',
            });
        
            const response = await axios.post('http://192.168.1.107:5000/api/ocr', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setData(response.data);
            console.log(data);
        } catch(error){
            console.log(error);
        } finally{
            setLoading(false);
        }
    };

    return { loading, scanImage, data };
};

export default useImageOCR