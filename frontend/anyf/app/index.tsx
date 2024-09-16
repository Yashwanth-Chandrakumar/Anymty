import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';

export default function Index() {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstTimeUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem('userInfo');
        const user = userJson ? JSON.parse(userJson) : null;
        const userToken = user?.token;

        console.log('User token:', userToken); // Debugging log

        if (userToken) {
          console.log('Redirecting to home.');
          setIsFirstTime(false);
        } else {
          console.log('Redirecting to login.');
          setIsFirstTime(true);
        }
      } catch (error) {
        console.error('Error reading user data:', error);
        setIsFirstTime(true);
      }
    };

    checkFirstTimeUser();
  }, []);

  if (isFirstTime === null) {
    return null; // Optionally show a loading spinner or placeholder
  }

  if (isFirstTime) {
    return <Redirect href="/loginscreen" />;
  } else {
    return <Redirect href="/(tabs)/home" />;
  }
}
