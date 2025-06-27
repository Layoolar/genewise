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
import { PrimaryButton } from '../reusables/PrimaryButton';
import { signUpSchema } from '../utils/validation';
import { Formik } from 'formik';
import { useAuth } from '../hooks/useAuth';
import { showErrorToast, showSuccessToast } from '../utils/toast';
import apiClient from '../utils/apiClient';
import { SignUpFormValues } from '../types/auth.d';
import { signUpInitialValues } from '../types/formHelpers';



const SignUp: React.FC = () => {
  const router = useRouter();
  const { setEmail } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  

  const handleSignUp = async (values: SignUpFormValues) => {
    setLoading(true);
      try {

       const response = await apiClient.post('/auth/signup', {
         first_name: values.first_name,
         last_name: values.last_name,
         email: values.email,
         password: values.password
       });


      if (response.status === 200) {
         const userData = {
         id: response.data.data.id,
        email: response.data.data.email,
        first_name: response.data.data.first_name,
        last_name: response.data.data.last_name,
        is_verified: response.data.data.is_verified,
       };

    
       await setEmail(userData.email);
       showSuccessToast("Account created successfully 🎉");
       router.push('/auth/verify');
      }
    
      } catch (error: any) {
      const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'An unknown error occurred';
      console.error('Error signing up:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });
    showErrorToast(errorMessage);
    } finally {
     setLoading(false);
    }
  }
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
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
            <Text style={styles.heading}>Welcome 👋</Text>
            <Text style={styles.greeting}>Create Your Account</Text>
          </LinearGradient>

          <View style={styles.formContainer}>
            <Formik
               initialValues={signUpInitialValues}
               validationSchema={signUpSchema}
               onSubmit={handleSignUp}
              >
               {({ handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                <>
            <Input
              label="First Name "
              placeholder="Joy"
              value={values.first_name}
              onChangeText={(text) => {
                handleChange('first_name')(text);
              }}
              onBlur={() => {
                handleBlur('first_name');
              }}
              error={errors.first_name}
              touched={touched.first_name}
            />
             <Input
              label="Last Name"
              placeholder="Doe"
              value={values.last_name}
              onChangeText={(text) => {
                handleChange('last_name')(text);
              }}
              onBlur={() => {
                handleBlur('last_name');
              }}
              error={errors.last_name}
              touched={touched.last_name}
            />
            <Input
              label="Email"
              placeholder="joydoe@example.com"
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
            <Input
              label="Confirm Password"
              placeholder="••••••••"
              value={values.passwordConfirm}
              onChangeText={handleChange('passwordConfirm')}
              onBlur={() => handleBlur('passwordConfirm')}
              secureTextEntry
              error={errors.passwordConfirm}
              touched={touched.passwordConfirm}
            />

               <PrimaryButton 
                title="Sign Up" 
                 onPress={async () => {
                 await handleSignUp(values);
                 }} 
                loading={loading}
                 />

               <View style={styles.bottomText}>
              <Text style={{ color: '#6b7280' }}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text style={{ color: '#1C5403', fontWeight: '600' }}>Sign In</Text>
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
};

const styles = StyleSheet.create({
  gradientContainer: {
    height: '32%',
    paddingTop: Platform.OS === 'android' ? 60 : 80,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: 'center'
  },
  logo: {
    width: 80,
    height: 80,
    position: 'absolute',
    top: Platform.OS === 'android' ? 48 : 64,
    right: 24,
    resizeMode: 'contain',
  },
  greeting: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 4,
  },
  heading: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
    backgroundColor: '#fff',
    marginTop: -24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  bottomText: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
});

export default SignUp;
