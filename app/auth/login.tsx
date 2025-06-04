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
  Image,
  StyleSheet
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
                style={styles.gradientContainer}
              >
                <Image
                  source={require('../../assets/images/genewiser1.png')}
                  style={styles.logo}
                />
          
                <Text style={styles.title}>Hello</Text>
                <Text style={[styles.title, { marginTop: 8 }]}>Sign In</Text>
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
            <PrimaryButton title="Sign In" onPress={handleSignIn} className="mt-8" />

            {/* Bottom Text */}
            <View className="mt-6 mb-6 flex-row justify-center">
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

const styles = StyleSheet.create({
  gradientContainer: {
    height: '30%',
    paddingTop: Platform.OS === 'android' ? 64 : 80,
    paddingBottom: 96,
    paddingHorizontal: 24,
    position: 'relative',
  },
  logo: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: Platform.OS === 'android' ? 48 : 64, 
    right: 16,
    resizeMode: 'contain',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
