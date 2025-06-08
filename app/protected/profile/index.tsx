import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Input } from '../../reusables/Input';
import { Dropdown } from '../../reusables/Dropdown';
import { PrimaryButton } from '../../reusables/PrimaryButton';
import { MultiSelectDropdown } from '@/app/reusables/MultiSelectDropdown';
import { useState } from 'react';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genotypes = ['AA', 'AS', 'SS', 'AC', 'SC'];
const activityLevels = ['Sedentary', 'Moderate', 'Active'];
const foodPreferencesOptions = ['Vegetarian', 'Vegan', 'Lactose-Free', 'Halal', 'Kosher'];

export default function ProfileScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [genotype, setGenotype] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [knownConditions, setKnownConditions] = useState('');
  const [allergies, setAllergies] = useState('');
  const [familyHistory, setFamilyHistory] = useState('');
  const [foodPreferences, setFoodPreferences] = useState<string[]>([]);

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    bloodGroup: '',
    genotype: ''
  });

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!isNaN(h) && !isNaN(w) && h > 0 && w > 0) {
      return (w / (h * h)).toFixed(2);
    }
    return '--';
  };

  const handleSubmit = () => {
    let valid = true;
    const newErrors = {
      fullName: '',
      email: '',
      bloodGroup: '',
      genotype: '',
    };

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Enter a valid email address';
      valid = false;
    }

    if (!bloodGroup.trim()) {
      newErrors.bloodGroup = 'Blood group is required';
      valid = false;
    }

    if (!genotype.trim()) {
      newErrors.genotype = 'Genotype is required';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      console.log('Profile submitted:', {
        fullName,
        email,
        age,
        sex,
        height,
        weight,
        bloodGroup,
        genotype,
        activityLevel,
        knownConditions,
        allergies,
        familyHistory,
        foodPreferences,
      });
      // router.push('/dashboard');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
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
              source={require('../../../assets/images/genewiser1.png')}
              style={styles.logo}
            />

            <View style={styles.headerTextContainer}>
              <Text style={styles.profileText}>Your Profile 🧬</Text>
              <Text style={styles.detailsText}>
                Complete your details to personalize your experience
              </Text>
            </View>
          </LinearGradient>

          <View style={styles.formContainer}>
            <Input
              label="Full Name"
              placeholder="Joy Doe"
              value={fullName}
              onChangeText={setFullName}
              error={errors.fullName}
            />
            <Input
              label="Email"
              placeholder="joydoe@example.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
            />
            <Dropdown
              label="Blood Group"
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
            <Input label="Age" placeholder="e.g., 28" keyboardType="numeric" value={age} onChangeText={setAge} />
            <Input label="Sex" placeholder="e.g., Male or Female" value={sex} onChangeText={setSex} />
            <Input label="Height (cm)" placeholder="e.g., 170" keyboardType="numeric" value={height} onChangeText={setHeight} />
            <Input label="Weight (kg)" placeholder="e.g., 65" keyboardType="numeric" value={weight} onChangeText={setWeight} />

            {/* BMI Display */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ color: '#333', fontWeight: 'bold', fontSize: 16 }}>BMI</Text>
              <View style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                padding: 12,
                marginTop: 8,
                backgroundColor: '#f9f9f9',
                alignItems: 'center',
              }}>
                <Text style={{ color: '#000' }}>{calculateBMI()}</Text>
              </View>
            </View>

            <Dropdown
              label="Activity Level"
              options={activityLevels}
              selectedValue={activityLevel}
              onValueChange={setActivityLevel}
            />
            <Input label="Known Conditions" placeholder="e.g., Asthma, Diabetes" value={knownConditions} onChangeText={setKnownConditions} />
            <Input label="Allergies" placeholder="e.g., Peanuts, Dust" value={allergies} onChangeText={setAllergies} />
            <Input label="Family History" placeholder="e.g., Hypertension" value={familyHistory} onChangeText={setFamilyHistory} />
            <MultiSelectDropdown
              label="Food Preferences"
              options={foodPreferencesOptions}
              selectedValues={foodPreferences}
              onValuesChange={setFoodPreferences}
            />

            {/* Submit Button */}
            <View style={{ marginTop: 24, marginBottom: 40 }}>
              <PrimaryButton title="Save Profile" onPress={handleSubmit} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    height: 220,
    paddingTop: Platform.OS === 'android' ? 60 : 80,
    paddingHorizontal: 24,
    paddingBottom: 32,
    position: 'relative',
  },
  logo: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: Platform.OS === 'android' ? 48 : 48,
    right: 24,
    resizeMode: 'contain',
  },
  headerTextContainer: {
    marginTop: Platform.select({ android: 40, ios: 10 }),
  },
  profileText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  detailsText: {
    color: 'white',
    fontSize: 18,
    marginTop: 4,
  },
  formContainer: {
    marginTop: Platform.select({ ios: -40, android: -20 }),
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: 'white',
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});
