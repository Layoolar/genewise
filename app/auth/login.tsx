import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Input } from '../reusables/Input';
import { Formik } from 'formik';
import { PrimaryButton } from '../reusables/PrimaryButton';
import apiClient from '../utils/apiClient';
import { showErrorToast, showSuccessToast } from '../utils/toast';
import { useAuth } from '../hooks/useAuth';
import { loginSchema } from '../utils/validation';
import { LoginFormValues } from '../types/auth.d';
import { loginInitialValues } from '../types/formHelpers';

// interface LoginFormValues {
//   email: string;
//   password: string;
// }

// const initialValues: LoginFormValues = {
//   email: '',
//   password: '',
// };

export default function Login() {
  const router = useRouter();
  const {signIn} = useAuth();
  const [loading, setLoading] = useState<boolean>(false);


 const handleSignIn = async (values: LoginFormValues) => {
  setLoading(true);

  try {
    const response = await apiClient.post('/auth/login', {
      email: values.email,
      password: values.password
    });

    const apiResponse = response.data;
    const token = apiResponse.data?.access_token;

    if (!token) {
      throw new Error('No token returned from server');
    }

    const user = apiResponse.data.user;

    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.FirstName,
      lastName: user.last_name,
      is_verified: user.is_verified,
    };

    // Checking if user is verified
    if (!userData.is_verified) {
      showErrorToast('Please verify your email before loggin in');
      router.push('/auth/verify');
      return;
    }

    await signIn(token, userData);
    showSuccessToast("Login successful 🎉");
    router.push('/protected/foods');

  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'An unknown error occurred';

    console.error('Error during login:', {
      message: error.message,
      status: error.response?.status,
      responseData: error.response?.data,
      stack: error.stack
    });

    showErrorToast(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }} 
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient
            colors={['#1C5403', '#020d00']}
            style={styles.gradientContainer}
          >
            <Image
              source={require('../../assets/images/genewiser1.png')}
              style={styles.logo}
            />

            <View style={styles.headerTextContainer}>
              <Text style={styles.welcomeText}>Welcome Back 👋</Text>
              <Text style={styles.signinText}>Sign In</Text>
            </View>
          </LinearGradient>

          <View
            className="shadow-lg flex-1 px-6 pt-8 -mt-12"
            style={{
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              backgroundColor: 'white',
            }}
          >
            <Formik
               initialValues={loginInitialValues}
              validationSchema={loginSchema}
              onSubmit={handleSignIn}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                <>
              <Input 
              label="Email"
              placeholder="joydeo@gmail.com"
              value={values.email}
              onChangeText={(text) => {
                handleChange('email')(text);
              }}
              onBlur={() => {
                handleBlur('email');
              }}
              keyboardType="email-address"
              error={errors.email}
              touched={touched.email}
            />

            <Input 
              label="Password"
              placeholder="••••••••"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={() => handleBlur('password')}
              secureTextEntry
              error={errors.password}
              touched={touched.password}
            />

            <TouchableOpacity className="self-end mt-3">
              <Text className="text-gray-700">Forgot password?</Text>
            </TouchableOpacity>

            <PrimaryButton 
              title="Sign In" 
              onPress={handleSubmit} 
              loading={loading}
              className="mt-8" />

            <View className="mt-6 mb-6 flex-row justify-center">
              <Text className="text-gray-500">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                <Text className="text-[#1C5403]">Sign Up</Text>
              </TouchableOpacity>
            </View>
                </>
              )}
           </Formik>
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
  headerTextContainer: {
    marginTop: Platform.select({ android: 32, ios: 0 }),
  },
  welcomeText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  signinText: {
    color: 'white',
    fontSize: 22,
    marginTop: 4,
  },
});
