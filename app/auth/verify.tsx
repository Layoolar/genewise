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

const VerifyScreen: React.FC = () => {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError("Please enter the full 6-digit code");
      return;
    }

    console.log('Verification code:', otp);
    router.push('/onboarding/onboarding');
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

            <OtpInput numberOfDigits={6} onCodeFilled={setOtp} error={error} />

            <PrimaryButton 
              title="Verify"
              onPress={handleVerify}
              className={`${otp.length !== 6 ? 'opacity-60' : ''} mt-6`}
            />

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
