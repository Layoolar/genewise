import React, { useState } from 'react';
import {
    SafeAreaView,
     View,
     KeyboardAvoidingView,
     Platform,
     Text,
     ScrollView,
     TouchableOpacity,
     Image,
     StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Input } from '../reusables/Input';
import { PrimaryButton } from '../reusables/PrimaryButton';

const SignUp: React.FC = () => {
    const router = useRouter();
    
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSignUp = () => {
        let valid = true;
        const newErrors = {
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
        };

        if (!fullName.trim()) {
            newErrors.fullName = "Full name is required";
            valid = false;
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is required";
            valid = false;
        }

        if (!password) {
            newErrors.password = "Password is required";
            valid = false;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Password do not match";
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
         router.push('/auth/verify')
        }
    }
    return (
     <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
           className="flex-1"
         >
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

      <Text style={styles.title}>Hello</Text>
      <Text style={[styles.title, { marginTop: 8 }]}>Sign Up</Text>
         </LinearGradient>

        {/* Form Card - Starts after gradient */ }
        <View
          className="shadow-lg flex-1 px-6 pt-8 -mt-12"
          style={{
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor: 'white',
          }}>
           <Input
             label="Full Name"
             placeholder="Joy Doe"
             value={fullName}
             onChangeText={setFullName}
             error={errors.fullName}
            />
            <Input 
              label="Email"
              placeholder="Joydeo@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              error={errors.email}
            />
            <Input 
              label="Password"
              placeholder="••••••••"
               value={password}
               onChangeText={setPassword}
               secureTextEntry
               error={errors.password}
              />
              <Input 
                 label="Password Confirm"
                 placeholder="••••••••"
                 value={confirmPassword}
                 onChangeText={setConfirmPassword}
                 secureTextEntry
                 error={errors.confirmPassword}
              />

              {/* Sign Up Button */ }
              <PrimaryButton title="Sign Up" onPress={handleSignUp} className="mt-3" />

              {/* Bottom Text */ }
              <View className="mt-auto mb-6 flex-row justify-end">
                  <Text className="text-gray-500">Already have an account?</Text>
                  <TouchableOpacity onPress={() => router.push('/auth/login')}>
                    <Text className="text-[#1C5403]">Sign In</Text>
                  </TouchableOpacity>
              </View>
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


export default SignUp;