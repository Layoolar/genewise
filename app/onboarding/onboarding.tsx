import { Ionicons } from '@expo/vector-icons';
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
  View,
} from 'react-native';
import { Dropdown } from '../reusables/Dropdown';
import { FileUpload } from '../reusables/FileUpload';
import { PrimaryButton } from '../reusables/PrimaryButton';

interface ConsentCheckboxProps {
  label: string;
  isChecked: boolean;
  onPress: () => void;
  error?: string;
}

const ConsentCheckbox: React.FC<ConsentCheckboxProps> = ({ label, isChecked, onPress, error }) => (
  <View className="mb-4">
    <TouchableOpacity onPress={onPress} className="flex-row items-center">
      <Ionicons
        name={isChecked ? 'checkbox-outline' : 'square-outline'}
        size={24}
        color={isChecked ? '#1C5403' : '#6B7280'}
      />
      <Text className="ml-3 text-base text-gray-700 flex-1">{label}</Text>
    </TouchableOpacity>
    {error ? <Text className="text-red-500 text-sm mt-1 ml-9">{error}</Text> : null}
  </View>
);

export default function OnboardingScreen() {
  const router = useRouter();

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genotypes = ['AA', 'AS', 'SS', 'AC', 'SC'];

  const [bloodGroup, setBloodGroup] = useState<string | null>(null);
  const [genotype, setGenotype] = useState<string | null>(null);
  const [dnaFile, setDnaFile] = useState<any>(null);

  const [termsAgreed, setTermsAgreed] = useState(false);
  const [dnaConsentAgreed, setDnaConsentAgreed] = useState(false);

  const [errors, setErrors] = useState({
    bloodGroup: '',
    genotype: '',
    termsConsent: '',
    dnaConsent: '',   
  });

  const handleContinue = () => {
    let valid = true;
    const newErrors = {
      bloodGroup: '',
      genotype: '',
      termsConsent: '',
      dnaConsent: '',
    };

    if (!bloodGroup) {
      newErrors.bloodGroup = 'Blood group is required';
      valid = false;
    }

    if (!genotype) {
      newErrors.genotype = 'Genotype is required';
      valid = false;
    }

    if (!termsAgreed) {
      newErrors.termsConsent = 'You must agree to the terms and conditions';
      valid = false;
    }

    if (!dnaConsentAgreed) {
      newErrors.dnaConsent = 'You must consent to DNA usage for healthy meals';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      console.log('Proceeding with:', { bloodGroup, genotype, dnaFile, termsAgreed, dnaConsentAgreed });
      router.push('/protected/chat/chat');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {/* Top Gradient Section */}
          <LinearGradient colors={['#1C5403', '#020d00']} style={styles.gradientContainer}>
            <Image source={require('../../assets/images/genewiser1.png')} style={styles.logo} />
            
            <View style={styles.headerTextContainer}>
              <Text style={styles.onboardingText}>Onboarding 🧬</Text>
            <Text style={styles.formText}>Fill up the form below.</Text>
            </View>
            
          </LinearGradient>

          {/* White Card Section */}
          <View
            className="shadow-lg flex-1 px-6 pt-8 -mt-12"
            style={{
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              backgroundColor: 'white',
            }}
          >
            <Text className="text-center text-[20px] font-bold mb-4">Personal Information</Text>
            <Text className="text-center text-[16px] text-gray-500 font-bold mb-6">
              Fill in the details to complete your profile.
            </Text>

            <Dropdown
              label="Blood Group *"
              options={bloodGroups}
              selectedValue={bloodGroup}
              onValueChange={setBloodGroup}
              error={errors.bloodGroup}
            />

            <Dropdown
              label="Genotype *"
              options={genotypes}
              selectedValue={genotype}
              onValueChange={setGenotype}
              error={errors.genotype}
            />

            <FileUpload label="DNA (Optional)" onFileSelected={setDnaFile} className="mt-4" />

            {/* Consent Checkboxes */}
            <View className="mt-6 mb-4">
              <ConsentCheckbox
                label="I agree with the terms and conditions of this app"
                isChecked={termsAgreed}
                onPress={() => setTermsAgreed(!termsAgreed)}
                error={errors.termsConsent}
              />
              <ConsentCheckbox
                label="I agree that genewise can use my DNA to generate healthy meals for me"
                isChecked={dnaConsentAgreed}
                onPress={() => setDnaConsentAgreed(!dnaConsentAgreed)}
                error={errors.dnaConsent}
              />
            </View>

            <PrimaryButton title="Continue" onPress={handleContinue} className="mt-6" />

            <TouchableOpacity
              className="items-center justify-center mt-4 mb-6 p-3 rounded-full bg-gray-100 self-start"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#1C5403" />
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
  headerTextContainer: {
      marginTop: Platform.select({ android: 32, ios: 0 }),
  },
  onboardingText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  formText: {
    color: 'white',
    fontSize: 18,
    marginTop: 4,
  },
});