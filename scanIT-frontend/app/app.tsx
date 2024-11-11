import React, { useEffect } from 'react'
import AppNavigator from './AppNavigator'
import { registerRootComponent } from 'expo'
import { initDB, shareDatabaseFile } from '@/database/local/sqLite';

const App = () => {

  const initDatabase = async () => {
    try{
      await initDB();
      console.log('Database initialized with success!');
    } catch(error){
      console.log('Error initializing database: ', error);
    }
    try{
      await shareDatabaseFile();
      console.log('Database shared with success!');
    } catch(error){
      console.log('Error sharing database: ', error);
    }
  };

  useEffect(() => {
    initDatabase();
  }, []);

  return <AppNavigator />
};

export default registerRootComponent(App);