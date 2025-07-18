import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Input } from '../../reusables/Input';
import { Dropdown } from '../../reusables/Dropdown';
import { PrimaryButton } from '../../reusables/PrimaryButton';
import { MultiSelectDropdown } from '@/app/reusables/MultiSelectDropdown';
import apiClient from '@/app/utils/apiClient';
import { showSuccessToast, showErrorToast } from '@/app/utils/toast';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genotypes = ['AA', 'AS', 'SS', 'AC', 'SC'];
const activityLevels = ['Sedentary', 'Moderate', 'Active'];
const foodPreferencesOptions = ['Vegetarian', 'Vegan', 'Lactose-Free', 'Halal', 'Kosher'];
const sexOptions = ['male', 'female'];
const rhOptions = ['Positive', 'Negative'];

export default function ProfileScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<string | null>(null);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodGroup, setBloodGroup] = useState<string | null>(null);
  const [genotype, setGenotype] = useState<string | null>(null);
  const [activityLevel, setActivityLevel] = useState<string | null>(null);
  const [rhFactor, setRhFactor] = useState<string | null>(null);
  const [knownConditions, setKnownConditions] = useState('');
  const [allergies, setAllergies] = useState('');
  const [familyHistory, setFamilyHistory] = useState('');
  const [foodPreferences, setFoodPreferences] = useState<string[]>([]);

  const [errors, setErrors] = useState({
    bloodGroup: '',
    genotype: '',
    age: '',
    sex: '',
    height: '',
    weight: '',
    activityLevel: '',
    rhFactor: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true); 
  const [profileExists, setProfileExists] = useState(false); 


  const fetchProfile = async () => {
    setIsProfileLoading(true);
    try {
      const userResponse = await apiClient.get('/user/');
      console.log('GET /user/ response:', userResponse.data);

      if (userResponse.status === 200 && userResponse.data && userResponse.data.data) {
        const userData = userResponse.data.data;
        setFullName(`${userData.first_name || ''} ${userData.last_name || ''}`.trim());
        setEmail(userData.email || '');

        if (userData.health_vitals) {
          const profileData = userData.health_vitals;
          
          const hasMeaningfulHealthVitals = (
            (profileData.age !== 0 && profileData.age !== null) ||
            (profileData.height !== 0 && profileData.height !== null) ||
            (profileData.weight !== 0 && profileData.weight !== null) ||
            (profileData.blood_group && profileData.blood_group.trim() !== '') ||
            (profileData.genotype && profileData.genotype.trim() !== '') ||
            (profileData.sex && profileData.sex.trim() !== '') ||
            (profileData.activity_level && profileData.activity_level.trim() !== '') ||
            (profileData.rh !== null) 
          );

          if (hasMeaningfulHealthVitals) {
            setAge(profileData.age?.toString() || '');
            setSex(profileData.sex || null);
            setHeight(profileData.height?.toString() || '');
            setWeight(profileData.weight?.toString() || '');
            setBloodGroup(profileData.blood_group || null);
            setGenotype(profileData.genotype || null);
            setActivityLevel(profileData.activity_level || null);
            setRhFactor(profileData.rh ? 'Positive' : 'Negative'); 
            setKnownConditions(profileData.known_conditions || '');
            setAllergies(profileData.allergies || '');
            setFamilyHistory(profileData.family_history || '');
            setFoodPreferences(
              profileData.food_preferences && typeof profileData.food_preferences === 'string' && profileData.food_preferences.trim() !== '' 
                ? profileData.food_preferences.split(', ').map((item: string) => item.trim())
                : []
            );
            setProfileExists(true); 
            showSuccessToast('Existing profile loaded!');
          } else {
            setProfileExists(false);
            console.log('Health vitals object found but contains no meaningful data. User needs to fill it out.');
          }
        } else {
          setProfileExists(false);
          console.log('No health vitals object found for this user. User needs to fill it out.');
        }
      } else {
        setProfileExists(false); 
        console.log('No user data found or unexpected response from /user/.');
        showErrorToast('Failed to load user data. Please try again.');
      }
    } catch (error: any) {
      console.error('Error fetching user or profile data:', error.response?.data || error.message);
      setProfileExists(false); 
      showErrorToast('An error occurred while loading your profile. Please try again.');
    } finally {
      setIsProfileLoading(false);
    }
  };


  useEffect(() => {
    fetchProfile();
  }, []); 

  const calculateBMI = () => {
    const h = parseFloat(height) / 100; 
    const w = parseFloat(weight);
    if (!isNaN(h) && !isNaN(w) && h > 0 && w > 0) {
      return (w / (h * h)); 
    }
    return 0; 
  };

  const handleSubmit = async () => {
    const newErrors = {
      bloodGroup: '', genotype: '', age: '', sex: '', height: '',
      weight: '', activityLevel: '', rhFactor: '',
    };
    let currentValid = true;

    if (!bloodGroup || bloodGroup.trim() === '') {
      newErrors.bloodGroup = 'Blood group is required';
      currentValid = false;
    }
    if (!genotype || genotype.trim() === '') {
      newErrors.genotype = 'Genotype is required';
      currentValid = false;
    }

    const parsedAge = parseInt(age);
    if (age.trim() === '' || isNaN(parsedAge) || parsedAge < 0) { 
      newErrors.age = 'Age is required and must be a valid number';
      currentValid = false;
    }

    if (!sex || sex.trim() === '') {
      newErrors.sex = 'Sex is required';
      currentValid = false;
    }

    const parsedHeight = parseFloat(height);
    if (height.trim() === '' || isNaN(parsedHeight) || parsedHeight <= 0) { 
      newErrors.height = 'Height is required and must be a valid number (cm)';
      currentValid = false;
    }

    const parsedWeight = parseFloat(weight);
    if (weight.trim() === '' || isNaN(parsedWeight) || parsedWeight <= 0) { 
      newErrors.weight = 'Weight is required and must be a valid number (kg)';
      currentValid = false;
    }

    if (!activityLevel || activityLevel.trim() === '') {
      newErrors.activityLevel = 'Activity level is required';
      currentValid = false;
    }

    if (!rhFactor || rhFactor.trim() === '') {
      newErrors.rhFactor = 'Rh factor is required';
      currentValid = false;
    }

    setErrors(newErrors);

    if (!currentValid) {
      showErrorToast('Please fill in all required fields before submitting.');
      console.log('Validation failed:', newErrors);
      return;
    }

    setIsSaving(true);

    try {
      const requestBody = {
         blood_group: bloodGroup?.trim(),
         genotype: genotype?.trim(),
         activity_level: activityLevel?.toLowerCase(),
         rh: rhFactor === 'Positive',
         age: parseInt(age),
         sex: sex?.toLowerCase(),
         height: parseFloat(height),
         weight: parseFloat(weight),
         known_conditions: knownConditions.trim() || 'none',
         allergies: allergies.trim() || 'none',
         family_history: familyHistory.trim() || 'none',
         food_preferences: foodPreferences.length > 0 ? foodPreferences.join(', ') : 'none',
       };
      // console.log('Sending request body:', requestBody);

      const response = await apiClient.put('/health/vitals/', requestBody);

      if (response.status === 200 || response.status === 201) {
        showSuccessToast(`Profile ${profileExists ? 'updated' : 'saved'} successfully!`);
        console.log('API Response:', response.data);
        // After successful save/update, re-fetch profile to ensure UI is up-to-date
        await fetchProfile(); 
      } else {
        showErrorToast(response.data?.message || `Failed to ${profileExists ? 'update' : 'save'} profile.`);
      }
    } catch (error: any) {
      console.error(`Error ${profileExists ? 'updating' : 'saving'} profile:`, error.response?.data || error.message);
      showErrorToast(error.response?.data?.message || `An error occurred while ${profileExists ? 'updating' : 'saving'} your profile.`);
    } finally {
      setIsSaving(false);
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

          {isProfileLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1C5403" />
              <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Input
                label="Full Name *"
                placeholder="Joy Doe"
                value={fullName}
                onChangeText={setFullName}
              />
              <Input
                label="Email *"
                placeholder="joydoe@example.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <Dropdown
                label="Blood Group *"
                options={bloodGroups}
                selectedValue={bloodGroup}
                onValueChange={setBloodGroup}
                error={errors.bloodGroup}
              />
              <Dropdown
                label="Rh Factor *"
                options={rhOptions}
                selectedValue={rhFactor}
                onValueChange={setRhFactor}
                error={errors.rhFactor}
              />
              <Dropdown
                label="Genotype *"
                options={genotypes}
                selectedValue={genotype}
                onValueChange={setGenotype}
                error={errors.genotype}
              />
              <Input 
                label="Age *" 
                placeholder="e.g., 28" 
                keyboardType="numeric"
                 value={age} 
                 onChangeText={setAge} 
                 error={errors.age} />
              <Dropdown
                label="Sex *"
                options={sexOptions}
                selectedValue={sex}
                onValueChange={setSex}
                error={errors.sex}
              />
              <Input label="Height (cm) *" placeholder="e.g., 170" keyboardType="numeric" value={height} onChangeText={setHeight} error={errors.height} />
              <Input label="Weight (kg) *" placeholder="e.g., 65" keyboardType="numeric" value={weight} onChangeText={setWeight} error={errors.weight} />

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
                  <Text style={{ color: '#000' }}>{calculateBMI().toFixed(2)}</Text>
                </View>
              </View>

              <Dropdown
                label="Activity Level *"
                options={activityLevels}
                selectedValue={activityLevel}
                onValueChange={setActivityLevel}
                error={errors.activityLevel}
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
                <PrimaryButton
                  title={isSaving ? 'Saving...' : (profileExists ? 'Edit Profile' : 'Save Profile')}
                  onPress={handleSubmit}
                  disabled={isSaving}
                />
                {isSaving && (
                  <View style={{ position: 'absolute', right: 20, top: '50%', transform: [{ translateY: -12 }] }}>
                    <ActivityIndicator size="small" color="#FFF" />
                  </View>
                )}
              </View>
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50, 
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});
