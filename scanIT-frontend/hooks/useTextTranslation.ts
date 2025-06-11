import { _post } from "@/utils/api";
import { useState } from "react"

const useTextTranslation = () => {
    const [loading, setLoading] = useState(false);

    const URL = "https://6f1e-84-232-135-18.ngrok-free.app";

    const detectLanguage = async (text: string) => {

        try{
            setLoading(true);
            const response = await _post(`${URL}/detect`, {text: text});
            console.log("Language detection response:", response.data);
            if(response.data && response.data.language)
                return response.data.language;
        }catch(error){
            console.error("Error detecting language:", error);
        }finally{
            setLoading(false);
        }
    }

    const translateText = async (text: string, target?: string) => {
        setLoading(true);
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
        }finally{
            setLoading(false);
        }
    }

    return { detectLanguage, translateText, loading };
}

export default useTextTranslation;