interface Product {
    _id: string;
    product_name: string;
    brands: string;
    categories: string;
    image_url: string;
    image_front_url: string;
    manufacturing_places: string;
    countries: string;
    stores: string;
    ingredients_text: string;
    additives_n: number;
    additives_tags: string[];
    allergens: string;
    allergens_tags: string[];
    nutriscore_grade: string;
    ecoscore_grade: string;
    ecoscore_score: number;
    nutriments: Nutriment;
    selected_images: {
        front: {
            display: { [key: string]: string };
            small: { [key: string]: string };
            thumb: { [key: string]: string };
        };
        ingredients: {
            display: { [key: string]: string };
            small: { [key: string]: string };
            thumb: { [key: string]: string };
        };
        nutrition: {
            display: { [key: string]: string };
            small: { [key: string]: string };
            thumb: { [key: string]: string };
        };
    };
}

interface AddProduct {
    barcode: string;
    product_name: string;
    brands: string;
    categories: string;
    countries: string;
    stores: string;
    ingredients_text: string;
    carbohydrates: number;
    carbohydrates_100g: number;
    energy: number;
    "energy-kcal": number;
    "energy-kcal_100g": number;
    energy_100g: number;
    fat: number;
    fat_100g: number;
    proteins: number;
    proteins_100g: number;
    salt: number;
    salt_100g: number;
    saturated_fat: number;
    saturated_fat_100g: number;
    sodium: number;
    sodium_100g: number;
    sugars: number;
    sugars_100g: number;
    
}

interface Nutriment {
    carbohydrates: number;
    carbohydrates_100g: number;
    carbohydrates_unit: string;
    energy: number;
    "energy-kcal": number;
    "energy-kcal_100g": number;
    "energy-kcal_unit": string;
    energy_100g: number;
    energy_unit: string;
    fat: number;
    fat_100g: number;
    fat_unit: string;
    proteins: number;
    proteins_100g: number;
    proteins_unit: string;
    salt: number;
    salt_100g: number;
    salt_unit: string;
    saturated_fat: number;
    saturated_fat_100g: number;
    saturated_fat_unit: string;
    sodium: number;
    sodium_100g: number;
    sodium_unit: string;
    sugars: number;
    sugars_100g: number;
    sugars_unit: string;
}

interface ScannedProduct {
    barcode: string;
    name: string;
    brand: string;
    image: string;
    nutriscore: string;
}