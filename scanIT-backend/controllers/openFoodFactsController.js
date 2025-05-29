const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

exports.addNewProduct = async (req, res) => {
    try{
        const { barcode, product_name, brands, categories, ...rest } = req.body;
        console.log("first")
        if(!barcode || !product_name || !brands || !categories){
            return res.status(400).json({error: 'Missing required fields(barcode, product name, brands, categories)'});
        }
        console.log("second")
        const URL = `https://ro.openfoodfacts.org/cgi/product_jqm2.pl`;
        const params = {
            code: barcode,
            user_id: process.env.OPEN_FOOD_FACTS_USER_ID,
            password: process.env.OPEN_FOOD_FACTS_PASSWORD,
            product_name: product_name,
            brands: brands,
            categories: categories,
        };
        Object.keys(rest).forEach(key => {
            if (rest[key] !== undefined && rest[key] !== null && rest[key] !== '' && rest[key] !== 0) {
                params[key] = rest[key];
            }
        });
        console.log("third");
        const response = await axios.get(URL, {
            params,
            timeout: 10000,
        });
        console.log("fourth")
        res.status(200).json(response.data);
    }catch(error){
        console.log("Error adding product",error);
        res.status(500).json({error: error.message});
    }
};

exports.addProductImage = async (req, res) => {
    try{
        console.log("Image upload started");
        if (!req.file) {
            console.log("No file in request");
            return res.status(400).json({error: 'No image file found'});
        }
        const { barcode, imagefield } = req.body;
        console.log("Request body:", req.body);
        console.log("File info:", req.file);
        if (!barcode || !imagefield) {
            console.log("Missing barcode or imagefield");
            return res.status(400).json({error: 'Missing required fields (barcode, imagefield)'});
        }

        let imageType = null;
        switch (imagefield){
            case 'front':
                imageType = 'imgupload_front';
                break;
            case 'ingredients':
                imageType = 'imgupload_ingredients';
                break;
            case 'nutrition':
                imageType = 'imgupload_nutrition';
                break;
            default:
                console.log("Invalid image field:", imagefield);
                return res.status(400).json({error: 'Invalid image field'});
        }
        
        console.log("Creating form");
        const form = new FormData();
        form.append('code', barcode);
        form.append('user_id', process.env.OPEN_FOOD_FACTS_USER_ID);
        form.append('password', process.env.OPEN_FOOD_FACTS_PASSWORD);
        form.append('imagefield', imagefield);
        
        const originalName = req.file.filename || `image_${Date.now()}.jpg`;

        form.append(imageType, req.file.buffer, originalName);

        console.log("Sending request to Open Food Facts API");
        const URL = `https://ro.openfoodfacts.org/cgi/product_image_upload.pl`;
        const response = await axios.post(
            URL,
            form,
            {
                headers: {
                    ...form.getHeaders(),
                },
                timeout: 10000,
            }
        );
        console.log("Rsponse received");
        console.log(response.data);
        res.status(200).json(response.data);
    }catch(error){
        console.log("Error adding product images",error);
        res.status(500).json({error: error.message});
    }
}

exports.editProduct = async (req, res) => {
    try{
        const { barcode, ...rest } = req.body;
        if(!barcode){   
            return res.status(400).json({error: 'Missing required field: barcode'});
        }

        const URL = `https://ro.openfoodfacts.org/cgi/product_jqm2.pl`
        const params = {
            code: barcode,
            user_id: process.env.OPEN_FOOD_FACTS_USER_ID,
            password: process.env.OPEN_FOOD_FACTS_PASSWORD
        }

        Object.keys(rest).forEach(key => {
            if (rest[key] !== undefined && rest[key] !== null && rest[key] !== '' && rest[key] !== 0) {
                if(key !== 'product_name' && key !== 'ingredients_text'){
                    params['add_'+key] = rest[key];
                } else {
                    params[key] = rest[key];
                }
            }
        });
        console.log(params);
        const response = await axios.get(URL, {
            params,
            timeout: 15000,
        });

        res.status(200).json(response.data);
    }catch(error){
        console.log("Error editing product",error);
        res.status(500).json({error: error.message});
    }
    
}