const express = require('express');
const cors = require('cors');
const { HfInference } = require('@huggingface/inference');
const dotenv = require('dotenv');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const uploadImage = multer({storage: multer.memoryStorage()});

app.post('/api/ocr', uploadImage.single('image'), async(req, res) => {
    if(!req.file){
        return res.status(400).json({error: 'Image not uploaded'});
    }
    
    try{
        const formData = new FormData();
        formData.append('image', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });
        const response = await axios.post('http://localhost:5001/ocr', formData, {
            headers: formData.getHeaders(),
        });

        res.json(response.data);
    } catch(error){
        res.status(500).json({error: error.message});
    }
});

//const huggingFace = new HfInference(process.env.HUGGINGFACE_API_KEY)

// app.post('/api/ocr', uploadImage.single('image'), async(req, res) => {
//     try{
//         console.log(req.body);
//         if(!req.file){
//             return res.status(400).json({error: 'Image not uploaded'});
//         }
//         const imageBuffer = req.file.buffer;

//         const result = await huggingFace.imageToText({
//             model: 'microsoft/trocr-large-printed',
//             data: imageBuffer,
//         });
//         res.json(result);
//     } catch (error){
//         res.status(500).json({error: error.message});
//     }
// });

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});