export interface AllergenIngredient{
    name: string;
    group: string;
    description: string;
}

export interface GetAllergenIngredient{
    id: number;
    name: string;
    group: string;
    description: string;
}

export const AllergenGroups = [
    "Gluten",
    "Crustacee",
    "Ouă",
    "Lactate",
    "Arahide",
    "Soia",
    "Pește",
    "Țelină",
    "Muștar",
    "Nucifere",
    "Fructe de mare",
    "Susan",
    "Lupin",
    "Moluște, scoici",
    "Scoici",
    "Sulfiți",
];