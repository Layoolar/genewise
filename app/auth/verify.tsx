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
import { Label } from '../reusables/Label';
import { OtpInput } from '../reusables/OtpInput';
import { PrimaryButton } from '../reusables/PrimaryButton';
import {  Formik } from 'formik';
import apiClient from '../utils/apiClient';
import { otpSchema } from '../utils/validation';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import { useAuth } from '../hooks/useAuth';
import { VerifyFormValues } from '../types/auth.d';
import { verifyInitialValues } from '../types/formHelpers';


const VerifyScreen: React.FC = () => {
  const router = useRouter();
  const { email } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleVerify = async (values: VerifyFormValues) => {
       if (!email) {
        showErrorToast('Email not found. Please sign up again.');
        return;
       }

       setLoading(true);

       try {
         const response = await apiClient.post('/auth/verify-email', {
            email,
            otp: values.otp
         });

         if (response.status === 200) {
          showSuccessToast('Verificatuion successful 🎉');
          router.push('/auth/login');
         }
       } catch (error: any) {
          const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'An unknown error occurred';

      console.error('Error verifying OTP:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack,
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
        className="flex-1"
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
              <Text style={styles.welcomeText}>Verify Email 👋</Text>
              <Text style={styles.subText}>Enter Code</Text>
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
            <Label text="Verification Code" className="text-center text-[20px] font-bold mb-4" />

            <Text className="text-center text-[16px] text-gray-500 font-bold mb-6">
              Enter the 6-digit code sent to your email.
            </Text>

            <Formik
              initialValues={verifyInitialValues}
              validationSchema={otpSchema}
              onSubmit={handleVerify}
            >
              {({ handleChange,  handleSubmit, values, errors, touched }) => (
                <>
                 <OtpInput 
                   numberOfDigits={6} 
                   onCodeFilled={handleChange('otp')}
                    error={errors.otp}
                    touched={touched.otp} 
                    />

                    {touched.otp && errors.otp && (
                      <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>
                      {errors.otp}
                     </Text> 
                    )}

                 <PrimaryButton 
                   title="Verify"
                   onPress={async () => {
                    await handleVerify(values);
                   }}
                   className="opacity-60 mt-6" 
                   loading={loading}
                   />
                </>
                )}
             </Formik>

            <TouchableOpacity className="mt-4" onPress={() => alert('Resend code')}>
              <Text className="text-[#1C5403] text-center">Resend Code</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
  subText: {
    color: 'white',
    fontSize: 22,
    marginTop: 4,
  },
});

export default VerifyScreen;