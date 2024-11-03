import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const db = SQLite.openDatabaseAsync('scanIT.db');
console.log(FileSystem.documentDirectory);

export const initDB = async () => {
    (await db).withTransactionAsync(async () => {
        const result = (await db).execAsync(
            `CREATE TABLE IF NOT EXISTS ingredients_allergens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT
            );`
        );
        console.log("aici: ", result);
    })
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