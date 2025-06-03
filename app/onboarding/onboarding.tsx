import React, { useState } from 'react';
import { 
 SafeAreaView,
 KeyboardAvoidingView,
 Platform,
 ScrollView,
  Text,
   View,
   TouchableOpacity,
   Image
} from "react-native";
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { Dropdown } from '../reusables/Dropdown';
import { FileUpload } from '../reusables/FileUpload';
import { PrimaryButton } from '../reusables/PrimaryButton';


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
            //router.push('/auth/dashboard');
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
                style={{
                   height: '30%',
                   paddingTop: 64,
                   paddingBottom: 96,
                   paddingHorizontal: 32,
                   position: 'relative'
                }}>
                  {/* Logo in the top right */}
                  <Image 
                    source={require('../../assets/images/onLogo.png')}
                    style={{
                      width: 50,
                      height: 50,
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      resizeMode: 'contain'
                    }}
                   />
                 <Text className="text-white text-[24px] font-bold">Onboarding</Text>
                 <Text className="text-white text-[24px] font-bold mt-2">Fill up the form below.</Text>
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
                   className="mt-4 mb-6"
                   onPress={() => router.back()}>
                     <Text className="text-[#1C5403]">Back</Text>
                 </TouchableOpacity>
             </View>
           </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
}