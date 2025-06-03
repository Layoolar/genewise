import React, { useState } from 'react';
import {
    SafeAreaView, 
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View, 
    Text,
    TouchableOpacity,
    Image,
    StyleSheet
 } from 'react-native';
 import { useRouter } from 'expo-router';
 import { LinearGradient } from 'expo-linear-gradient';
import { Label } from '../reusables/Label';
import { OtpInput } from '../reusables/OtpInput';
import { PrimaryButton } from '../reusables/PrimaryButton';

const VerifyScreen: React.FC = () => {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleVerify = (code: string) => {
        setOtp(code);
        console.log('Verification code:', code);
        router.push('/onboarding/onboarding');
    }
    
    // setTimeout(() => {
       
    // });
    
  return (
   <SafeAreaView className="flex-1 bg-white">
     <KeyboardAvoidingView
       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
       className="flex-1">
       <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled">
           <LinearGradient
                     colors={['#A9C9A4', '#1C5403']}
                    style={styles.gradientContainer}>
                   <Image
                     source={require('../../assets/images/genewiser1.png')}
                    style={styles.logo}
                   />
         
               <Text style={styles.title}>Verify Email</Text>
               <Text style={[styles.title, { marginTop: 8 }]}>Enter Code</Text>
             </LinearGradient>

         {/* Form Card - Start after Gradient */ }
        <View className="shadow-lg flex-1 px-6 pt-8 -mt-12"
           style={{
             borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor: 'white',
           }}>
           <Label text="Verification Code" className="text-center text-[20px] font-bold mb-4"  />

           <Text className="text-center text-[16px] text-gray-500 font-bold mb-6">
             Enter the 6-digit code sent to your email.
           </Text>

           {/* OTP Input */ }
           <OtpInput numberOfDigits={6} onCodeFilled={handleVerify} error={error} />

           {/* Submit Button */ }
           <PrimaryButton 
              title="Verify"
              onPress={() => handleVerify}
              // onPress={() => {
              //   if (otp.length !== 6) {
              //      setError("Please enter the full 6-digit code");
              //   }
              // }}
              className={`${otp.length !== 6 ? 'opacity-60' : ''}`}
           /> 

           <TouchableOpacity className="mt-4" onPress={() => alert('Resend code')}>
              <Text className="text-[#1C5403] text-center">Resend Code</Text>
           </TouchableOpacity>
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
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: 'relative',
  },
  logo: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: Platform.OS === 'android' ? 48 : 64, // Adjusted upward
    right: 16,
    resizeMode: 'contain',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default VerifyScreen;