import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStorage from 'expo-secure-store';

const lightColors = {
    primary: '#13a89e',
    secondary: '#DBE4EE',
    third: '#025D8A',
    warning: '#EAC435',
    danger: '#DE541E',
    success: '#4CAF50',
    white: '#ffffff',
    Oldthird: '#0C090D',
    newThird: '#08415C'
};

const darkColors = {
    primary: '#13a89e',
    secondary: '#37393A',
    third: '#C2D076',
    warning: '#EAC435',
    danger: '#DE541E',
    success: '#4CAF50',
    white: '#5A5A5A',
    Oldthird: '#0C090D',
    newThird: '#08415C'
}

type Theme = 'light' | 'dark';

const ThemeContext = createContext({
    theme: 'light' as Theme,
    colors: lightColors,
    toggleTheme: () => {}
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme , setTheme] = useState<Theme>('light');

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        const loadTheme = async () => {
            try{
                const savedTheme = await SecureStorage.getItemAsync("theme");
                console.log("Saved theme: ", savedTheme);
                if(savedTheme){
                    setTheme(savedTheme as Theme);
                }
            }catch(error){
                console.log("Error on loadTheme: ", error);
                throw error;
            }
        }
        loadTheme();
    }, []);

    useEffect(() => {
        const saveTheme = async () => {
            try{
                await SecureStorage.setItemAsync("theme", theme);
            }catch(error){
                console.log("Error on saveTheme: ", error);
                throw error;
            }
        };
        saveTheme();
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, colors: theme === 'light' ? lightColors : darkColors, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);