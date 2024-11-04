import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CURRENT_DB_VERSION = '1.0.0';
const db = SQLite.openDatabaseAsync('scanIT.db');
console.log(FileSystem.documentDirectory);

export const initDB = async () => {
    await AsyncStorage.removeItem('dbVersion');
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

export const getIngredientsAllergens = async () => {
    (await db).withTransactionAsync(async () => {
        const result =  (await db).getAllSync('SELECT * FROM ingredients_allergens');
        console.log(result);
    })
};

const addAllergenIngredient = async (name: string, description: string) => {
    try{
        await (await db).execAsync(`INSERT INTO ingredients_allergens (name, description) VALUES ('${name}', '${description}')`);
        console.log(`Inserted: ${name} - ${description}`);
    } catch(error){
        console.log('Error adding ingredient allergen: ', error);
    }
}

const populateDB = async () => {
    (await db).withTransactionAsync(async () => {
        const result = (await db).execAsync(
            `CREATE TABLE IF NOT EXISTS ingredients_allergens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT
            );`
        );
    });
    //await addAllergenIngredient('Peanuts', 'Common allergen found in many snacks.');
    //await addAllergenIngredient('Shellfish', 'Seafood allergen, avoid if allergic.');
}

const updateDB = async (oldVersion: string) => {
    if(oldVersion < '1.0.1'){
        console.log('Updating to version 1.0.1');
    }
}