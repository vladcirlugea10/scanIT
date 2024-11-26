import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import allergenIngredients from '@/assets/data/allergen_data';
import {AllergenIngredient, GetAllergenIngredient } from '@/types/AllergenIngredient';
import unhealthyIngredients from '@/assets/data/unhealthy_data';

const CURRENT_DB_VERSION = '1.0.0';
const db = SQLite.openDatabaseAsync('scanIT.db');
console.log(FileSystem.documentDirectory);

export const initDB = async () => {
    //await AsyncStorage.removeItem('dbVersion');
    const dbVersion = await AsyncStorage.getItem('dbVersion');
    console.log(dbVersion);
    if(dbVersion === null){
        console.log('First launch');
        await populateDB();
        await AsyncStorage.setItem('dbVersion', CURRENT_DB_VERSION);
    } else if (dbVersion !== CURRENT_DB_VERSION){
        console.log('Database update');
        await updateDB(dbVersion);
        await AsyncStorage.setItem('dbVersion', CURRENT_DB_VERSION);
    } else {
        console.log('Database already initialized');
    }
};

export const shareDatabaseFile = async () => {
    const dbFilePath = `${FileSystem.documentDirectory}SQLite/scanIT.db`;

    const fileExists = await FileSystem.getInfoAsync(dbFilePath);
    if (!fileExists.exists) {
        console.log('Database file not found');
        return;
    }

    if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(dbFilePath);
    } else {
        console.log('Sharing is not available on this device');
    }
};

export const getIngredientsAllergens = async (): Promise<GetAllergenIngredient[]> => {
    const result = (await db).getAllSync('SELECT * FROM ingredients_allergens') as GetAllergenIngredient[];
        return result.map(ingredient => ({
            id: ingredient.id,
            name: ingredient.name,
            group: ingredient.group,
            description: ingredient.description
        }));
};

export const getIngredientsUnhealthy = async (): Promise<GetAllergenIngredient[]> => {
    const result = (await db).getAllSync('SELECT * FROM ingredients_unhealthy') as GetAllergenIngredient[];
        return result.map(ingredient => ({
            id: ingredient.id,
            name: ingredient.name,
            group: ingredient.group,
            description: ingredient.description
        }));
};

const addAllergenIngredient = async (name: string, group: string, description: string) => {
    try{
        await (await db).execAsync(`INSERT INTO ingredients_allergens (name, "group", description) VALUES ('${name}', '${group}', '${description}')`);
        console.log(`Inserted: ${name} - ${group} - ${description}`);
    } catch(error){
        console.log('Error adding ingredient allergen: ', error);
    }
}

const addUnhealthyIngredient = async (name: string, group: string, description: string) => {
    try{
        await (await db).execAsync(`INSERT INTO ingredients_unhealthy (name, "group", description) VALUES ('${name}', '${group}', '${description}')`);
        console.log(`Inserted: ${name} - ${group} - ${description}`);
    } catch(error){
        console.log('Error adding ingredient unhealthy: ', error);
    }
}

const addBulkAllergenIngredients = async (ingredients: AllergenIngredient[]) => {
    try{
        await (await db).withTransactionAsync(async () => {
            for(const ingredient of ingredients){
                await addAllergenIngredient(ingredient.name, ingredient.group, ingredient.description);
            }
        });
    } catch(error){
        console.log('Error adding bulk ingredient allergens: ', error);
    }
}

const addBulkUnhealthyIngredients = async (ingredients: AllergenIngredient[]) => {
    try{
        await (await db).withTransactionAsync(async () => {
            for(const ingredient of ingredients){
                await addUnhealthyIngredient(ingredient.name, ingredient.group, ingredient.description);
            }
        });
    } catch(error){
        console.log('Error adding bulk ingredient unhealthy: ', error);
    }
}

const populateDB = async () => {
    await (await db).execAsync(
        `CREATE TABLE IF NOT EXISTS ingredients_allergens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            "group" TEXT,
            description TEXT
        );
        CREATE TABLE IF NOT EXISTS ingredients_unhealthy (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            "group" TEXT,
            description TEXT
        );`
    );

    await addBulkAllergenIngredients(allergenIngredients);
    await addBulkUnhealthyIngredients(unhealthyIngredients);
}

const updateDB = async (oldVersion: string) => {
    if(oldVersion < '1.0.1'){
        console.log('Updating to version 1.0.1');
    }
}