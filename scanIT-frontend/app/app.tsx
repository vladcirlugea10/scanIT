import 'react-native-url-polyfill/auto';
import React, { useEffect } from 'react'
import AppNavigator from './AppNavigator'
import { registerRootComponent } from 'expo'
import { initDB } from '@/database/local/sqLite';
import { AuthProvider } from '@/hooks/useAuth';
import * as LinkingExpo from 'expo-linking';
import { Linking } from 'react-native';

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

    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      console.log('Deep link: ', url);
    };

    Linking.addEventListener('url', handleDeepLink);
    return () => {
      Linking.removeAllListeners('url');
    }
  }, []);

  const linking = {
    prefixes: ['myapp://', LinkingExpo.createURL('/')],
    config: {
      screens: {
        ResetPassword: 'reset-password',
      }
    }
  }

  return (
    <AuthProvider>
      <AppNavigator linking={linking} />
    </AuthProvider>
  );
};

export default registerRootComponent(App);