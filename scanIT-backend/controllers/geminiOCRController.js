const axios = require('axios');

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
exports.scanImage = async (req, res) => {
    try{
        if (!req.file) {
            return res.status(400).json({ error: 'Image not provided' });
        }

        const image = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype;

        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: "Extract all the text from this image clearly and accurately." },
                        {
                            inline_data: {
                                mime_type: mimeType,
                                data: image,
                            }
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 2048,
            }
        };

        const response = await axios.post(GEMINI_API_URL, requestBody, {
            headers: {
                "Content-Type": "application/json",
            },
            timeout: 20000,
        });
        console.log("Gemini API Response:", response.data);
        const extractedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No text found!";

        return res.status(200).json({success: true, text: extractedText});
    }catch(error){
        console.error("Error in scanImage:", error.message);
        return res.status(500).json({success: false, error: error.message});
    }
}