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
  SafeAreaView,
  ActivityIndicator,
  Modal
} from 'react-native';
import apiClient from '@/app/utils/apiClient';
import { showSuccessToast, showErrorToast } from '@/app/utils/toast';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

interface Professional {
  id: number;
  name: string;
  role: 'Doctor' | 'Dietitian' | 'Nutritionist';
  price: string;
  image: string;
  calendlyLink?: string; 
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

  
  const [calendlyModalVisible, setCalendlyModalVisible] = useState(false);
  const [calendlyUrl, setCalendlyUrl] = useState('');

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
      calendlyLink: 'https://calendly.com/olayiwolaayoola/new-meeting' 
    },
    {
      id: 2,
      name: 'Chantel Okafor',
      role: 'Dietitian',
      price: '$40/session',
      image: 'https://placehold.co/120x120/ADD8E6/000000?text=Chantel', 
      calendlyLink: 'https://calendly.com/olayiwolaayoola/new-meeting' 
    },
    {
      id: 3, 
      name: 'Grace Okoro',
      role: 'Nutritionist',
      price: '$40/session',
      image: 'https://placehold.co/120x120/90EE90/000000?text=Grace', 
      calendlyLink: 'https://calendly.com/olayiwolaayoola/new-meeting' 
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

                {/* Schedule Button - Now opens Calendly Webview */}
                <TouchableOpacity
                  style={styles.scheduleCard}
                  onPress={() => {
                    if (selectedProfessional.calendlyLink) {
                      setCalendlyUrl(selectedProfessional.calendlyLink);
                      setCalendlyModalVisible(true);
                      setModalVisible(false);
                      setSelectedProfessional(null); 
                    } else {
                      showErrorToast('Calendly link not available for this professional.');
                    }
                  }}
                >
                  <Text style={styles.slotText}>Schedule Appointment</Text>
                  <Text style={styles.joinText}>Open Calendly ➡️</Text>
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

      {/* Calendly WebView Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={calendlyModalVisible}
        onRequestClose={() => setCalendlyModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.webviewHeader}>
            <TouchableOpacity onPress={() => setCalendlyModalVisible(false)} style={styles.webviewCloseButton}>
              <Ionicons name="close" size={28} color="#1C5403" />
            </TouchableOpacity>
            <Text style={styles.webviewTitle}>Schedule with Calendly</Text>
          </View>
          {calendlyUrl ? (
            <WebView
              source={{ uri: calendlyUrl }}
              style={{ flex: 1 }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.webviewLoading}>
                  <ActivityIndicator size="large" color="#1C5403" />
                  <Text className="mt-4 text-gray-600">Loading Calendly...</Text>
                </View>
              )}
            />
          ) : (
            <View style={styles.webviewError}>
              <Text style={styles.webviewErrorText}>No Calendly URL provided.</Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>
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
 
  webviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  webviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C5403',
    flex: 1, 
    textAlign: 'center', 
    marginRight: 40, 
  },
  webviewCloseButton: {
    padding: 5,
    position: 'absolute', 
    left: 10,
    zIndex: 1, 
  },
  webviewLoading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    zIndex: 999, 
  },
  webviewError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
  },
  webviewErrorText: {
    color: '#721c24',
    fontSize: 16,
    textAlign: 'center',
  },
});