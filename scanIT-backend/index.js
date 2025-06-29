const express = require('express');
const cors = require('cors');
const { HfInference } = require('@huggingface/inference');
const dotenv = require('dotenv');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
require('./database');

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

//authentication
app.use('/api/auth', require('./routes/userAuth'));
//user
app.use('/api/user', require('./routes/user'));
//open food facts
app.use('/api/open-food-facts', require('./routes/openFoodFacts'));
//gemini OCR
app.use('/api/gemini-ocr', require('./routes/geminiOCR'));

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
const localIP = '192.168.1.9';
app.listen(port, localIP, () => {
    console.log(`Server running at http://${localIP}:${port}`);
});