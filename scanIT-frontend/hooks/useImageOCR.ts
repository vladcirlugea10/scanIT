import { useState } from "react";
import axios from "axios";
import Image from "@/types/Image";
import OCRResult from "@/types/OCRTypes";
import * as FileSystem from "expo-file-system";

const useImageOCR = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<OCRResult>({ text: [] });

    const API_KEY = "AIzaSyBftBCvPpSKAGWTSz3mEQ7qdtl1OIKCJSU"; // Replace with your actual API key
    
    // Updated to use gemini-1.5-flash as recommended in the error message
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const scanImage = async (image: Image) => {
        setLoading(true);
        setData({ text: [] });

        try {
            // Convert image to base64
            const base64Image = await convertImageToBase64(image.uri);

            // Prepare the request payload according to Gemini API requirements
            const requestBody = {
                contents: [
                    {
                        parts: [
                            { text: "Extract all the text from this image clearly and accurately." },
                            { 
                                inline_data: { 
                                    mime_type: "image/jpeg", // Adjust if needed (image/png, etc.)
                                    data: base64Image 
                                } 
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 2048
                }
            };

            // Send request to Google Gemini API
            const response = await axios.post(GEMINI_API_URL, requestBody, {
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: 20000,
            });

            console.log("OCR Response:", response.data);
            
            // Extract the text from response
            const extractedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No text detected.";

            setData({ text: [extractedText] });
        } catch (error) {
            console.error("OCR Error:", error);
            // Add more detailed error logging
            if (axios.isAxiosError(error)) {
                console.error("Error details:", error.response?.data);
            }
            setData({ text: ["Error extracting text."] });
        } finally {
            setLoading(false);
        }
    };

    // Convert image URI to Base64
    const convertImageToBase64 = async (imageUri: string): Promise<string> => {
        return await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
    };

    return { loading, scanImage, data };
};

export default useImageOCR;