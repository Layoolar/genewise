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
  Modal,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { Dropdown } from '../reusables/Dropdown';
import { FileUpload } from '../reusables/FileUpload';
import { PrimaryButton } from '../reusables/PrimaryButton';
import apiClient from '@/app/utils/apiClient';
import { showSuccessToast, showErrorToast } from '@/app/utils/toast';
import DocumentPicker from 'expo-document-picker';
import { useAuth } from '../hooks/useAuth';

interface ConsentCheckboxProps {
  label: string;
  isChecked: boolean;
  onPress?: () => void; 
  error?: string;
  onLabelPress?: () => void; 
  disableCheckbox?: boolean; 
}

const ConsentCheckbox: React.FC<ConsentCheckboxProps> = ({ 
  label, 
  isChecked, 
  onPress, 
  error, 
  onLabelPress, 
  disableCheckbox
 }) => (
  <View className="mb-4">
    <View className="flex-row items-center">
      <TouchableOpacity onPress={onPress} disabled={disableCheckbox}>
        <Ionicons
          name={isChecked ? 'checkbox-outline' : 'square-outline'}
          size={24}
          color={isChecked ? '#1C5403' : '#6B7280'}
        />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={onLabelPress || (disableCheckbox ? undefined : onPress)} 
          className="flex-1 ml-3">
        <Text className="text-base text-gray-700">{label}</Text>
      </TouchableOpacity>
    </View>
    {error ? <Text className="text-red-500 text-sm mt-1 ml-9">{error}</Text> : null}
  </View>
);

interface TermsAndConditionsModalProps {
  visible: boolean;
  onClose: () => void;
  onAgreeAndClose: () => void; 
}

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
    visible, 
    onClose, 
    onAgreeAndClose 
  }) => {
  const termsContent = `
## Genewise App: Terms and Conditions

**Last Updated:** July 5, 2025

Welcome to Genewise! This application provides personalized food suggestions based on your provided health data, including blood group, genotype, and optionally, your DNA information. By using this app, you agree to the following terms and conditions.

**1. Acceptance of Terms**
By accessing or using the Genewise app, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use the app.

**2. Purpose of the App**
Genewise is designed to offer **food suggestions only**. These suggestions are generated based on the health data you provide. The app is a tool for informational purposes and should not be considered a substitute for professional medical advice, diagnosis, or treatment.

**3. Data Collection and Privacy**
* **Required Information:** To provide personalized suggestions, we collect your blood group and genotype.
* **Optional DNA Information:** You have the option to upload your DNA information. If you choose to do so, you explicitly consent to Genewise using this data solely for the purpose of generating more tailored healthy meal suggestions.
* **Data Usage:** Your data (blood group, genotype, and optional DNA) will be used exclusively within the Genewise app to personalize your food recommendations. We are committed to protecting your privacy and handling your data securely. Please refer to our Privacy Policy for more details on how we collect, use, and protect your information.

**4. Disclaimer of Medical Advice**
* **Not a Medical Professional:** Genewise is not a medical device, nor are its suggestions medical advice. The app does not diagnose, treat, cure, or prevent any disease or medical condition.
* **Consult a Professional:** Always consult with a qualified healthcare professional (doctor, dietitian, nutritionist) before making any decisions about your diet, health, or medical treatment, especially if you have existing health conditions, allergies, or concerns.
* **No Responsibility:** Genewise, its developers, and affiliates cannot be held responsible for any health outcomes, adverse effects, or damages that may arise from following the app's suggestions. You use this app and its suggestions at your own risk.

**5. User Responsibilities**
* **Accuracy of Information:** You are responsible for providing accurate and truthful information regarding your blood group, genotype, and any optional DNA data. Inaccurate information may lead to inappropriate food suggestions.
* **Independent Verification:** You should independently verify any information obtained from the app before relying on it.

**6. Limitation of Liability**
To the fullest extent permitted by law, Genewise and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your access to or use of or inability to access or use the app; (b) any conduct or content of any third party on the app; or (c) unauthorized access, use, or alteration of your transmissions or content.

**7. Changes to Terms**
We reserve the right to modify these Terms and Conditions at any time. We will notify you of any significant changes by posting the new terms within the app. Your continued use of the app after such modifications will constitute your acknowledgment of the modified Terms and Conditions and agreement to abide and be bound by them.

**8. Contact Us**
If you have any questions about these Terms and Conditions, please contact us through the app's support channels.
  `;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.termsModalContent}>
          <ScrollView style={styles.termsScrollView}>
            <Text style={styles.termsTitle}>Genewise App: Terms and Conditions</Text>
            <Text style={styles.termsText}>{termsContent.trim()}</Text>
          </ScrollView>
          <TouchableOpacity onPress={onAgreeAndClose} style={styles.termsAgreeButton}>
            <Text style={styles.termsCloseButtonText}>I Understand and Agree</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


export default function OnboardingScreen() {
  const router = useRouter();
  const { updateUser } = useAuth();
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genotypes = ['AA', 'AS', 'SS', 'AC', 'SC'];

  const [bloodGroup, setBloodGroup] = useState<string | null>(null);
  const [genotype, setGenotype] = useState<string | null>(null);
  const [dnaFile, setDnaFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null); 
  const [country, setCountry] = useState('');
  const [tribe, setTribe] = useState(''); 

  const [termsAgreed, setTermsAgreed] = useState(false);
  const [dnaConsentAgreed, setDnaConsentAgreed] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false); 

  const [errors, setErrors] = useState({
    bloodGroup: '',
    genotype: '',
    termsConsent: '', 
    dnaConsent: '', 
  });

  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleAgreeToTerms = () => {
    setTermsAgreed(true);
    setShowTermsModal(false);
  };

  const handleContinue = async () => {
    let valid = true;
    const newErrors = { 
      bloodGroup: '',
      genotype: '',
      termsConsent: '',
      dnaConsent: '',
    };

    // --- Validation ---
    if (!bloodGroup) {
      newErrors.bloodGroup = 'Blood group is required';
      valid = false;
    }

    if (!genotype) {
      newErrors.genotype = 'Genotype is required';
      valid = false;
    }

    if (!country.trim()) {
      showErrorToast('Country is required.');
      valid = false;
    }

    if (!termsAgreed) {
      newErrors.termsConsent = 'You must agree to the terms and conditions';
      valid = false;
    }

    if (dnaFile && !dnaConsentAgreed) {
      newErrors.dnaConsent = 'You must consent to DNA usage for healthy meals if uploading a file';
      valid = false;
    }

    if (dnaFile && (!dnaFile.uri || !dnaFile.name || !dnaFile.mimeType)) {
        showErrorToast('Selected DNA file is incomplete or invalid. Please choose another file.');
        valid = false;
    }

    setErrors(newErrors); 

    if (!valid) {
      showErrorToast('Please fill in all required fields and agree to consents.');
      return; 
    }

    setIsSubmitting(true); 

    try {
      const formData = new FormData();

      const jsonData = {
        blood_group: bloodGroup,
        genotype: genotype,
      };
      formData.append('data', JSON.stringify(jsonData));

      const userFormData = {
        country: country,
        tribe: tribe, 
      };
      formData.append('user', JSON.stringify(userFormData));

       if (dnaFile?.uri && dnaFile?.name) {
          let fileUri = dnaFile.uri;
       if (Platform.OS === 'android' && !fileUri.startsWith('file://')) {
         fileUri = `file://${fileUri}`;
       }
 
       let fileMimeType = dnaFile.mimeType || 'application/octet-stream'; 
       const fileExtension = dnaFile.name?.split('.').pop()?.toLowerCase();

    if (fileExtension === 'txt') {
        fileMimeType = 'text/plain';
     } else if (fileExtension === 'json') {
        fileMimeType = 'application/json';
     } else if (fileExtension === 'vcf') {
        fileMimeType = 'text/vcard'; 
     } else if (fileExtension === 'pdf') {
        fileMimeType = 'application/pdf';
    } else if (['jpg', 'jpeg'].includes(fileExtension || '')) {
        fileMimeType = 'image/jpeg';
    } else if (fileExtension === 'png') {
       fileMimeType = 'image/png';
   }

   const fileToUpload = {
     uri: fileUri,
     name: dnaFile.name,
     type: fileMimeType,
   };

    formData.append('file', fileToUpload as any);
  }

   const onboardingResponse = await apiClient.patch('/user/onboarding', formData, {
      headers: {
       'Content-Type': undefined, 
      },
   });

   if (onboardingResponse.status === 200 || onboardingResponse.status === 201) {
       updateUser({
          country: country.trim(),
          tribe: tribe.trim(),
       });

      showSuccessToast('Onboarding complete! Welcome to Genewise.');
      router.push('/protected/profile');
   } else {
     showErrorToast(onboardingResponse.data?.message || 'Failed to complete onboarding. Unexpected response.');
   }

   } catch (overallError: any) {
      console.error('Overall onboarding process error:', overallError.response?.data || overallError.message);
      showErrorToast(overallError.response?.data?.message || 'An unexpected error occurred during onboarding. Please try again.');
   } finally {
      setIsSubmitting(false);
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

            {/* Country Input (required) */}
            <TextInput
              value={country}
              onChangeText={setCountry}
              placeholder="Enter your country *"
              placeholderTextColor="#000"
              className="border border-gray-300 rounded-lg p-4 mb-4 text-[#000]" 
            />

            {/* Tribe Input (optional) */}
            <TextInput
              value={tribe}
              onChangeText={setTribe}
              placeholder="Tribe (optional)"
              placeholderTextColor="#000" 
              className="border border-gray-300 rounded-lg p-4 mb-4 text-[#000]" 
            />

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

            <FileUpload label="DNA (Optional)" onFileSelected={setDnaFile} />
            {!dnaFile && (
              <Text className="text-sm text-gray-500 italic mt-1 mb-3">
              You can skip this step if you don’t have a DNA file.
             </Text>
            )}

            {/* Consent Checkboxes */}
            <View className="mt-6 mb-4">
              <ConsentCheckbox
                label="I agree with the terms and conditions of this app"
                isChecked={termsAgreed}
                onPress={() => { /* Checkbox click is disabled for terms */ }}
                onLabelPress={() => setShowTermsModal(true)} 
                error={errors.termsConsent}
                disableCheckbox={true} 
              />
             {dnaFile && (
               <ConsentCheckbox
                label="I agree that genewise can use my DNA to generate healthy meals for me"
                isChecked={dnaConsentAgreed}
                onPress={() => setDnaConsentAgreed(!dnaConsentAgreed)}
                error={errors.dnaConsent}
              />
             )}
            </View>

            <PrimaryButton 
              title={isSubmitting ? <ActivityIndicator color="#fff" /> : "Continue"} 
              onPress={handleContinue} 
              className="mt-6" 
              disabled={isSubmitting} 
            />

            <TouchableOpacity
              className="items-center justify-center mt-4 mb-6 p-3 rounded-full bg-gray-100 self-start"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#1C5403" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Terms and Conditions Modal */}
      <TermsAndConditionsModal
        visible={showTermsModal}
        onClose={() => setShowTermsModal(false)} 
        onAgreeAndClose={handleAgreeToTerms} 
      />
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

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  termsModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  termsScrollView: {
    marginBottom: 20,
  },
  termsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#1C5403',
  },
  termsText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  termsAgreeButton: { 
    backgroundColor: '#1C5403',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  termsCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
