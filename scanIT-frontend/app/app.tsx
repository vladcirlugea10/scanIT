import 'react-native-url-polyfill/auto';
import React, { useEffect } from 'react'
import AppNavigator from './AppNavigator'
import { registerRootComponent } from 'expo'
import { initDB } from '@/database/local/sqLite';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from './ColorThemeContext';
import '@/i18next';
import Toast from 'react-native-toast-message';

const App = () => {
  const initDatabase = async () => {
    try {
      await initDB();
      console.log('Database initialized with success!');
    } catch(error) {
      console.log('Error initializing database: ', error);
    }
  };

  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
      <Toast />
    </ThemeProvider>
  );
};

export default registerRootComponent(App);