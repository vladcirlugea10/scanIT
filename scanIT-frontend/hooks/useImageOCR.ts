import { useState } from "react";
import Image from "@/types/Image";
import OCRResult from "@/types/OCRTypes";
import * as FileSystem from "expo-file-system";
import { _post } from "@/utils/api";

const useImageOCR = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<OCRResult>({ text: [] });

    const scanImage = async (image: Image) => {
        setLoading(true);
        setData({ text: [] });

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

    const convertImageToBase64 = async (imageUri: string): Promise<string> => {
        return await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
    };

    return { loading, scanImage, data };
};

export default useImageOCR;