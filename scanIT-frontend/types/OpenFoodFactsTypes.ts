interface Product {
    product_name: string;
    brands: string;
    image_url: string;
    manufacturing_places: string;
    countries: string;
    stores: string;
    ingredients_text: string;
    additives: string;
    additives_tags: string[];
    allergens: string;
    allergens_tags: string[];
    nutriscore_grade: string;
    nutriments: Nutriment;
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