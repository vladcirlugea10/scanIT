import { useState } from "react";
import Image from "@/types/Image";
import OCRResult from "@/types/OCRTypes";
import { _post } from "@/utils/api";

const useImageOCR = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<OCRResult>({ text: [] });

    const URL = "https://9f82-84-232-135-16.ngrok-free.app";

    const scanImage = async (image: Image) => {
        setLoading(true);
        setData({ text: [] });
        console.log("GEMINI HERE");
        try {
            const formData = new FormData();
            formData.append('image', {
                uri: image.uri,
                name: 'image.jpg',
                type: 'image/jpeg'
            });

            const response = await _post("/gemini-ocr/scan-image", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 20000
            });

            console.log("Backend OCR Response:", response.data);

            if (response.data && response.data.text) {
                setData({ text: [response.data.text] });
            } else {
                setData({ text: ["No text detected."] });
            }
        } catch (error) {
            console.error("OCR Error:", error);
            setData({ text: ["Error extracting text."] });
        } finally {
            setLoading(false);
        }
    };

    const scanImageOffline = async (image: Image) => {
        setLoading(true);
        setData({text: []});
        console.log("EASYOCR HERE");
        try{
            const formData = new FormData();
            formData.append('image', {
                uri: image.uri,
                type: 'image/jpg',
                name: 'image.jpg',
            });

            const response = await _post(`${URL}/ocr`, formData, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 20000 }); 
            setData(response.data);
        } catch(error){
            console.log(error);
        } finally{
            setLoading(false);
        }
    };

    return { loading, scanImage, scanImageOffline, data };
};

export default useImageOCR;