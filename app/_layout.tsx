import { Stack } from 'expo-router';
import React from 'react';
import "../global.css";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="auth/signup"
        options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="auth/login"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="auth/verify"
          options={{ headerShown: false }}
        />
        <Stack.Screen
           name="onboarding/onboarding"
           options={{ headerShown: false }}
        />
        <Stack.Screen
          name="protected/foods"
          options={{ headerShown: false }}
        />
    </Stack>
  );
};

export default RootLayout;