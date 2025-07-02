import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Linking,
  ActivityIndicator
} from 'react-native';
import apiClient from '@/app/utils/apiClient';
import { showSuccessToast, showErrorToast } from '@/app/utils/toast';

interface Professional {
  id: number;
  name: string;
  role: 'Doctor' | 'Dietitian' | 'Nutritionist';
  price: string;
  image: string;
}

interface FoodItem {
  id: string;
  user_id: string;
  name: string;
  origin: string;
  day_of_week: string;
  meal: 'Breakfast' | 'Lunch' | 'Dinner';
}

export default function FoodsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedProType, setSelectedProType] = useState<'Doctor' | 'Dietitian/Nutritionist' | null>(null);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFoods = async () => {
    setIsLoading(true); 
    try {
      const response = await apiClient.get('/foods/'); 
      
      if (response.status === 200 && response.data && Array.isArray(response.data.data)) {
        setFoods(response.data.data); 
        showSuccessToast('Foods loaded successfully!');
      } else {
        showErrorToast(response.data?.message || 'Failed to load foods. Unexpected response format.');
        setFoods([]); 
      }
    } catch (error: any) {
      console.error('Error fetching foods:', error.response?.data || error.message);
      showErrorToast(error.response?.data?.message || 'An error occurred while fetching foods.');
      setFoods([]); 
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []); 

  const professionals: Professional[] = [
    {
      id: 1,
      name: 'Dr. Adeola Johnson',
      role: 'Doctor',
      price: '$50/session',
      image: 'https://placehold.co/120x120/FFC0CB/000000?text=Dr.+Adeola',
    },
    {
      id: 2,
      name: 'Chantel Okafor',
      role: 'Dietitian',
      price: '$40/session',
      image: 'https://placehold.co/120x120/ADD8E6/000000?text=Chantel', 
    },
    {
      id: 3, 
      name: 'Grace Okoro',
      role: 'Nutritionist',
      price: '$40/session',
      image: 'https://placehold.co/120x120/90EE90/000000?text=Grace', 
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        {/* Header Button to open the professional selection modal */}
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
            setSelectedProfessional(null);
            setSelectedProType(null);
          }}
          className="bg-[#1C5403] py-4 rounded-xl items-center justify-center mb-6" 
        >
          <Text className="text-white font-bold">Talk to a Professional</Text>
        </TouchableOpacity>

        {/* Conditional rendering for loading, empty state, or food list */}
        {isLoading ? (
          <View className="flex-1 justify-center items-center py-10">
            <ActivityIndicator size="large" color="#1C5403" />
            <Text className="mt-4 text-gray-600">Loading foods...</Text>
          </View>
        ) : foods.length === 0 ? (
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-500 text-lg">No foods found.</Text>
            <Text className="text-gray-400 text-sm mt-2">Try generating a timetable first!</Text>
          </View>
        ) : (
          foods.map((food, index) => (
            <TouchableOpacity
              key={index}
              className="bg-[#1C5403] p-4 rounded-lg mb-4 overflow-hidden shadow-md">
              <View className="flex-1">
                <Text className="text-base font-bold text-white">{food.name}</Text>
                <Text className="text-gray-200 mt-1">Origin: {food.origin}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Modal for Selecting Professional */}
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedProfessional ? (
              <View style={{ alignItems: 'center', width: '100%'}}>
                <Image
                  source={{ uri: selectedProfessional.image }}
                  style={styles.professionalDetailImage}
                />
                <Text style={styles.professionalName}>{selectedProfessional.name}</Text>
                <Text style={styles.professionalRole}>
                  {selectedProfessional.role} • {selectedProfessional.price}
                </Text>

                {/* Schedule Button */}
                <TouchableOpacity
                  style={styles.scheduleCard}
                  onPress={() => {
                    const meetLink = 'https://meet.google.com/new?hs=193&deep_link_id=new-room' + Date.now();
                    Linking.openURL(meetLink).catch(() =>
                      alert('Could not open Google Meet')
                    );
                  }}
                >
                  <Text style={styles.slotText}>Mon 10:00 AM</Text>
                  <Text style={styles.joinText}>Join Now ➡️</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.closeButton, { backgroundColor: '#1C5403' }]} 
                  onPress={() => setSelectedProfessional(null)}
                >
                  <Text style={styles.closeButtonText}>Back to Professionals</Text>
                </TouchableOpacity>
              </View>
            ) : selectedProType ? (
              <>
                <Text style={styles.modalTitle}>
                  Select a {selectedProType === 'Doctor' ? 'Doctor' : 'Dietitian/Nutritionist'}
                </Text>
                {professionals
                  .filter(prof => {
                    if (selectedProType === 'Doctor') return prof.role === 'Doctor';
                    if (selectedProType === 'Dietitian/Nutritionist') return prof.role === 'Dietitian' || prof.role === 'Nutritionist';
                    return false;
                  })
                  .map((prof) => (
                    <TouchableOpacity
                      key={prof.id}
                      style={styles.professionalCard}
                      onPress={() => setSelectedProfessional(prof)}
                    >
                      <Image source={{ uri: prof.image }} style={styles.professionalImage} />
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={styles.professionalName}>{prof.name}</Text>
                        <Text style={styles.professionalRole}>
                          {prof.role} • {prof.price}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedProType(null)} 
                >
                  <Text style={styles.closeButtonText}>Back to Categories</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>What kind of professional are you looking for?</Text>
                <TouchableOpacity
                  style={[styles.professionalCard, { backgroundColor: '#E8EDE5', justifyContent: 'center' }]}
                  onPress={() => setSelectedProType('Doctor')}
                >
                  <Text style={styles.professionalName}>Talk to a Doctor</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.professionalCard, { backgroundColor: '#E8EDE5', justifyContent: 'center' }]}
                  onPress={() => setSelectedProType('Dietitian/Nutritionist')}
                >
                  <Text style={styles.professionalName}>Talk to a Dietitian/Nutritionist</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)} 
                >
                  <Text style={styles.closeButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 24,
    zIndex: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    maxHeight: 600,
    alignItems: 'center',
    width: '100%'
  },
  professionalDetailImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 12,
      alignSelf: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  professionalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
  },
  professionalImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  professionalName: {
    color: '#1C5403',
    fontWeight: 'bold',
    fontSize: 16,
  },
  professionalRole: {
    color: '#666',
    fontSize: 14,
  },
  scheduleButton: {
    backgroundColor: '#1C5403',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  scheduleText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  scheduleCard: {
    backgroundColor: '#E8EDE5',
    padding: 16,
    borderRadius: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
  },
  slotText: {
    color: '#1C5403',
    fontWeight: 'bold',
  },
  joinText: {
    color: '#1C5403',
    fontWeight: 'bold',
    marginTop: 4,
  },
  closeButton: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: 'stretch'
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
