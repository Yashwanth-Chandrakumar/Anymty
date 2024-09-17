import { useFonts } from 'expo-font';
import { Stack } from 'expo-router'; // Ensure you are importing Stack from expo-router
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Show nothing until fonts are loaded
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* <Stack.Screen name="/" options={{ headerShown: false }} /> */}
      <Stack.Screen name="loginscreen" options={{ headerShown: false }} />
      <Stack.Screen name="registerscreen" options={{ headerShown: false }} />
      <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
