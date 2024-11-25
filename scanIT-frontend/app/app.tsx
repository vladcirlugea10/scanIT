import 'react-native-url-polyfill/auto';
import React, { useEffect } from 'react'
import AppNavigator from './AppNavigator'
import { registerRootComponent } from 'expo'
import { initDB, shareDatabaseFile } from '@/database/local/sqLite';
import { AppRegistry } from 'react-native';

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

  return <AppNavigator />
};

export default registerRootComponent(App);