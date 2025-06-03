// app/login/Login.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { PrimaryButton } from '../reusables/PrimaryButton';
import { Input } from '../reusables/Input';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleSignIn = () => {
    let valid = true;

    const newErrors = {
      email: '',
      password: ''
    };

    if (!email.trim()) {
        newErrors.email = "Email is required";
        valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
       newErrors.email = "Email is required";
       valid = false;
    }

    if (!password) {
        newErrors.password = "Password is required";
        valid = false;
    }

    setErrors(newErrors);

    if (valid) {
    // router.push('/auth/onboarding');
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Wrap in KeyboardAvoidingView for better keyboard handling */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }} 
          keyboardShouldPersistTaps="handled">
          {/* Header with Gradient */}
          <LinearGradient
           colors={['#A9C9A4', '#1C5403']}
            className="px-8 pt-16 pb-24 rounded-b-[40px]"
            style={{
              height: '30%',
              paddingTop: 64,
              paddingBottom: 96,
              paddingHorizontal: 32,
              position: 'relative'
            }}
          >
            {/* Logo in the top right */ }
            <Image 
              source={require('../../assets/images/onLogo.png')}
              style={{
                width: 50,
                height: 50,
                position: 'absolute',
                top: 16,
                right: 16,
                resizeMode: 'contain'
              }}
            />
            <Text className="text-white text-[24px] font-bold">
               Hello
              </Text>
            <Text className="text-white text-[24px] font-bold mt-2">Sign in!</Text>
          </LinearGradient>

          {/* Form Card - Starts after gradient */}
          <View className="shadow-lg flex-1 px-6 pt-8 -mt-12"
            style={{
              borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor: 'white',
            }}>
               <Input 
                  label="Email"
                  placeholder="Joydeo@gmail.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  error={errors.email}
               />

               <Input 
                 label="Password"
                 placeholder="••••••••"
                 value={password}
                 onChangeText={setPassword}
                 secureTextEntry
                 error={errors.password}
               />

            {/* Forgot Password */}
            <TouchableOpacity className="self-end mt-3">
              <Text className="text-gray-700">Forgot password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <PrimaryButton title="Sign In" onPress={handleSignIn} className="mt-3" />

            {/* Bottom Text */}
            <View className="mt-auto mb-6 flex-row justify-end">
              <Text className="text-gray-500">Don't have account? </Text>
              <TouchableOpacity onPress={()  => router.push('/auth/signup')}>
                <Text className="text-[#1C5403]">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}