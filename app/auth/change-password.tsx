import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import { changePasswordSchema } from '../utils/validation';
import { changePasswordInitialValues } from '../types/formHelpers';
import { ChangePasswordFormValues } from '../types/auth.d';
import { Input } from '../reusables/Input';
import { PrimaryButton } from '../reusables/PrimaryButton';
import { showErrorToast, showSuccessToast } from '../utils/toast';
import apiClient from '../utils/apiClient';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


export default function ChangePassword() {
    const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangePassword = async (values: ChangePasswordFormValues) => {
    setIsSubmitting(true);
    try {
       if (!apiClient) {
          showErrorToast('API client not initialized. Please try again later.');
          return;
      }
      const response = await apiClient.post('/user/change-password', {
        current_password: values.currentPassword,
        new_password: values.newPassword,
      });
       console.log("Received response from PATCH /user/change-password:", response.status, response.data);

      if (response.status === 200) {
        showSuccessToast('Password changed successfully!');
        router.push('/auth/login'); 
      } else {
        const errorMessage = response.data?.message || 'Failed to change password. Unexpected response.';
        console.error('Unexpected success response structure from /user/change-password:', response);
        showErrorToast(errorMessage);
      }
    } catch (error: any) {
      console.error('Caught error in handleChangePassword:', error); 

     let displayMessage = 'An unexpected error occurred. Please try again.';
      if (error.response) {
        console.error('API Error Response Data:', error.response.data);
        console.error('API Error Status:', error.response.status);
        console.error('API Error Headers:', error.response.headers);
        if (error.response.status === 401) {
            displayMessage = 'Current password is incorrect.';
        } else if (error.response.status === 400) {
             displayMessage = error.response.data?.message || 'Invalid request. Please check your input.';
        } else {
            displayMessage = error.response.data?.message || `Server error (${error.response.status}). Please try again.`;
        }
      } else if (error.request) {
        console.error('Network Error - No response received:', error.request);
        displayMessage = 'Network error. Please check your internet connection and try again.';
      } else {
        console.error('General Error Message:', error.message);
        displayMessage = error.message || displayMessage; 
      }
      showErrorToast(displayMessage);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
   <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1}}
          keyboardShouldPersistTaps="handled">
            <LinearGradient
               colors={['#1C5403', '#020d00']}
                style={styles.gradientContainer}>
                  {/* Back Button */ }
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
               </TouchableOpacity>
                 <View style={styles.headerTextContainer}>
                    <Text style={styles.welcomeText}>Change your password</Text>
                    <Text style={styles.instructionText}>Enter your current password and a new password.</Text>
                </View>
              </LinearGradient>

            <View
               className="shadow-lg flex-1 px-6 pt-8 -mt-12"
             style={{
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              backgroundColor: 'white',
             }}>
          <Formik
            initialValues={changePasswordInitialValues}
            validationSchema={changePasswordSchema}
            onSubmit={handleChangePassword}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
              dirty,
            }) => (
              <>
                <Input
                  label="Current Password"
                  placeholder="Enter current password"
                  value={values.currentPassword}
                  onChangeText={handleChange('currentPassword')}
                  onBlur={() => handleBlur('currentPassword')}
                  secureTextEntry
                  error={touched.currentPassword ? errors.currentPassword : undefined}
                  touched={!!touched.currentPassword}  
                  inputStyle={{ color: '#222' }}
                />

                <Input
                  label="New Password"
                  placeholder="Enter new password"
                  value={values.newPassword}
                  onChangeText={handleChange('newPassword')}
                  onBlur={() => handleBlur('newPassword')}
                  secureTextEntry
                  error={touched.newPassword ? errors.newPassword : undefined}
                  touched={!!touched.newPassword}
                  inputStyle={{ color: '#222' }}
                />

                <PrimaryButton
                  title={isSubmitting ? "Changing..." : "Change Password"}
                  onPress={handleSubmit as any}
                  loading={isSubmitting}
                  disabled={!isValid || !dirty || isSubmitting}
                />
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
  headerTextContainer: {
    marginTop: Platform.select({ android: 32, ios: 0 }),
  },
  welcomeText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 20 : 30, 
    left: 20,
    zIndex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formContainerWrapper: {
    flex: 1,
  },
  formContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  instructionText: {
   color: 'white',
    fontSize: 18,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 20, 
  },
});
