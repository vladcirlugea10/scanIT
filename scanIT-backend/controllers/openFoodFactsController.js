const axios = require("axios");

exports.addNewProduct = async (req, res) => {
    try{
        const { barcode, product_name, brands, categories, ...rest } = req.body;

        if(!barcode || !product_name || !brands || !categories){
            return res.status(400).json({error: 'Missing required fields(barcode, product name, brands, categories)'});
        }

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

        const response = await axios.get(URL, {
            params,
            timeout: 10000,
        });

        res.status(200).json(response.data);
    }catch(error){
        console.log("Error adding product",error);
        res.status(500).json({error: error.message});
    }
}; 

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
            timeout: 10000,
        });

        res.status(200).json(response.data);
    }catch(error){
        console.log("Error editing product",error);
        res.status(500).json({error: error.message});
    }
    
}