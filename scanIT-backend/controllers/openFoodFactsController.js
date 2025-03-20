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