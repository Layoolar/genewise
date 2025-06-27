// app/_layout.tsx

import { Stack } from 'expo-router';
import React from 'react';
import '../global.css';
import { AuthProvider } from './context/AuthContext';
import Toast from 'react-native-toast-message';

const RootLayout = () => {
  return (
    <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/verify" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="protected/foods" options={{ headerShown: false }} />
        </Stack>
        <Toast />
    </AuthProvider>
  );
};

export default RootLayout;