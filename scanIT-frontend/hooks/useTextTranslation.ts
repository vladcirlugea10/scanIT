import { _post } from "@/utils/api";
import { useState } from "react"

const useTextTranslation = () => {

    const URL = "https://c542-84-232-135-16.ngrok-free.app";

    const detectLanguage = async (text: string) => {
        try{
            const response = await _post(`${URL}/detect`, {text: text});
            console.log("Language detection response:", response.data);
            if(response.data && response.data.language)
                return response.data.language;
        }catch(error){
            console.error("Error detecting language:", error);
        }
    }

    const translateText = async (text: string, target?: string) => {
        try{
            console.log("Translating text:", text, "to", target);
            if(!target){
                console.log("No target language provided");
                const response = await _post(`${URL}/translate`, {text: text});
                console.log("Translation response:", response.data);
                if(response.data && response.data.translatedText)
                    return response.data.translatedText;
            }
            const response = await _post(`${URL}/translate`, {text: text, target: target});
            console.log("Translation response:", response.data);
            if(response.data && response.data.translatedText)
                return response.data.translatedText;
        }catch(error){
            console.error("Error translating text:", error);
        }
    }

    return { detectLanguage, translateText };
}

export default useTextTranslation;