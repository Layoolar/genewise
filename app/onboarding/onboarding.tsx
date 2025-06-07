import React, { useState } from 'react';
import { 
 SafeAreaView,
 KeyboardAvoidingView,
 Platform,
 ScrollView,
  Text,
   View,
   TouchableOpacity,
   Image,
   StyleSheet
} from "react-native";
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { Dropdown } from '../reusables/Dropdown';
import { FileUpload } from '../reusables/FileUpload';
import { PrimaryButton } from '../reusables/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';


export default function OnboardingScreen() {
    const router = useRouter();

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const genotypes = ['AA', 'AS', 'SS', 'AC', 'SC'];

    const [bloodGroup, setBloodGroup] = useState<string | null>(null);
    const [genotype, setGenotype] = useState<string | null>(null);
    const [dnaFile, setDnaFile] = useState<any>(null);

    const [errors, setErrors] = useState({
        bloodGroup: '',
        genotype: '',
    });

    const handleContinue = () => {
        let valid = true;
        const newErrors = {
          bloodGroup: '',
          genotype: '',
        };

        if (!bloodGroup) {
          newErrors.bloodGroup = 'Blood group is required';
          valid = false;
        }

        if (!genotype) {
           newErrors.genotype = 'Genotype is required';
           valid = false;
        }
        
        setErrors(newErrors);

        if (valid) {
          router.push('/chat/chat');
        }
    }
    return (
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1">
           <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
             <LinearGradient
                colors={['#A9C9A4', '#1C5403']}
                style={styles.gradientContainer}>
                   <Image
                     source={require('../../assets/images/genewiser1.png')}
                     style={styles.logo}
                    />
             
                   <Text style={styles.title}>Onboarding</Text>
                   <Text style={[styles.title, { marginTop: 8 }]}>Fill up the form below.</Text>
                </LinearGradient>

             <View className="shadow-lg flex-1 px-6 pt-8 -mt-12"
              style={{
                 borderTopLeftRadius: 40,
                 borderTopRightRadius: 40,
                 backgroundColor: 'white', 
               }}>
 
                 {/* Blood Group */ }
                 <Dropdown
                    label="Blood Group *"
                    options={bloodGroups}
                    selectedValue={bloodGroup}
                    onValueChange={setBloodGroup}
                    error={errors.bloodGroup}
                 />

                 {/* Genotype */ }
                 <Dropdown
                   label="Genotype *"
                   options={genotypes}
                   selectedValue={genotype}
                   onValueChange={setGenotype}
                   error={errors.genotype}
                 />

                 {/* DNA File Upload */ }
                 <FileUpload label="DNA (Optional)" onFileSelected={setDnaFile} />

                 {/* Continue Button */ }
                 <PrimaryButton title="Continue" onPress={handleContinue} className="mt-4" />

                 <TouchableOpacity
                   className="items-center justify-center mt-4 mb-6 p-3 rounded-full bg-gray-100 self-start "
                   onPress={() => router.back()}>
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
});