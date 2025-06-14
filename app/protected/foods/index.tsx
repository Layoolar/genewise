// app/protected/foods/index.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Linking
} from 'react-native';
import { useRouter} from 'expo-router';

interface Professional {
  id: number;
  name: string;
  role: 'Doctor' | 'Dietitian' | 'Nutritionist';
  price: string;
  image: string;
}

export default function FoodsScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  // Food list
  const foods = [
    {
      name: 'Red Meat',
      origin: 'Cow, Sheep, Goat',
      image: 'https://images.pexels.com/photos/6287544/pexels-photo-6287544.jpeg' 
    },
    {
      name: 'Moin Moin',
      origin: 'African',
      image: 'https://www.seriouseats.com/thmb/FyrplS03gmSGkFlRtc5WuqMp5YY%3D/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20230111-Moin-Moin-Maureen-Celestine-hero-5c656cbc3b684be1b1f29414f2bdc29c.JPG' 
    },
    {
      name: 'Fried Rice',
      origin: 'Worldwide',
      image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg' 
    },
    {
      name: 'Egusi Soup',
      origin: 'Nigeria',
      image: 'https://kikifoodies.com/wp-content/uploads/2024/12/IMG_4537.jpeg' 
    },
    {
      name: 'Jollof Rice',
      origin: 'West Africa',
      image: 'https://voicesofafrica.co.za/wp-content/uploads/2013/03/Party-Jollof-rice.jpg' 
    },
    {
      name: 'Oatmeal',
      origin: 'Europe',
      image: 'https://sdmntprukwest.oaiusercontent.com/files/00000000-552c-6243-a562-718e79fd4a72/raw?se=2025-06-11T09%3A56%3A12Z&sp=r&sv=2024-08-04&sr=b&scid=6f355c54-3c6c-5946-b83e-1c7c8e0f5d73&skoid=82a3371f-2f6c-4f81-8a78-2701b362559b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-11T06%3A08%3A17Z&ske=2025-06-12T06%3A08%3A17Z&sks=b&skv=2024-08-04&sig=nY9RA6BArPY1/lbLlSXIiiq0gtC3BN%2BavVDjI3GwaSE%3D'
    },
    {
      name: 'Yam & Egg Sauce',
      origin: 'Nigeria',
      image: 'https://sdmntprnortheu.oaiusercontent.com/files/00000000-6274-61f4-92ac-a229a17aa0da/raw?se=2025-06-11T09%3A54%3A15Z&sp=r&sv=2024-08-04&sr=b&scid=a55d34f8-86a5-5202-ab4a-6a2d6855c505&skoid=82a3371f-2f6c-4f81-8a78-2701b362559b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-11T07%3A17%3A17Z&ske=2025-06-12T07%3A17%3A17Z&sks=b&skv=2024-08-04&sig=WiYt0/5bYuh/UD5/eSdUqG5hlWKd6bHxONFXA4IqsZU%3D'
    },
    {
      name: 'Vegetable Soup',
      origin: 'Worldwide',
      image: 'https://www.dashofjazz.com/wp-content/uploads/2024/03/Dash-of-Jazz-Efo-Elegusi-26-500x500.jpg'
    }
  ];

 
  const professionals: Professional[] = [
    {
      id: 1,
      name: 'Dr. Adeola Johnson',
      role: 'Doctor',
      price: '$50/session',
      image: 'https://sdmntpritalynorth.oaiusercontent.com/files/00000000-5388-6246-828a-629db3277581/raw?se=2025-06-14T18%3A09%3A53Z&sp=r&sv=2024-08-04&sr=b&scid=71dba5b3-1eb8-52d5-ba70-1c2c305e96cd&skoid=b32d65cd-c8f1-46fb-90df-c208671889d4&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-14T08%3A15%3A48Z&ske=2025-06-15T08%3A15%3A48Z&sks=b&skv=2024-08-04&sig=2a3gS8nAWv76CpIqKyMS2vwCVGxPbw4g3G8tVn5J/BQ%3D',
    },
    {
      id: 2,
      name: 'Chantel Okafor',
      role: 'Dietitian',
      price: '$40/session',
      image: 'https://sdmntpritalynorth.oaiusercontent.com/files/00000000-5388-6246-828a-629db3277581/raw?se=2025-06-14T18%3A09%3A53Z&sp=r&sv=2024-08-04&sr=b&scid=71dba5b3-1eb8-52d5-ba70-1c2c305e96cd&skoid=b32d65cd-c8f1-46fb-90df-c208671889d4&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-14T08%3A15%3A48Z&ske=2025-06-15T08%3A15%3A48Z&sks=b&skv=2024-08-04&sig=2a3gS8nAWv76CpIqKyMS2vwCVGxPbw4g3G8tVn5J/BQ%3D',
    },
    {
      id: 3, 
      name: 'Grace Okoro',
      role: 'Nutritionist',
      price: '$40/session',
      image: 'https://sdmntpritalynorth.oaiusercontent.com/files/00000000-5388-6246-828a-629db3277581/raw?se=2025-06-14T18%3A09%3A53Z&sp=r&sv=2024-08-04&sr=b&scid=71dba5b3-1eb8-52d5-ba70-1c2c305e96cd&skoid=b32d65cd-c8f1-46fb-90df-c208671889d4&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-14T08%3A15%3A48Z&ske=2025-06-15T08%3A15%3A48Z&sks=b&skv=2024-08-04&sig=2a3gS8nAWv76CpIqKyMS2vwCVGxPbw4g3G8tVn5J/BQ%3D',
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        {/* Header Button */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-[#1C5403] py-4 rounded-xl items-center justify-center mb-6" 
        >
          <Text className="text-white font-bold">Talk to a Professional</Text>
        </TouchableOpacity>

        {/* Food List */}
        {foods.map((food, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center bg-[#1C5403] p-4 rounded-lg mb-4 overflow-hidden shadow-md">
            <Image
              source={{ uri: food.image }}
              className="w-20 h-20 rounded-md"
              resizeMode="cover"
            />

            <View className="ml-4 flex-1">
              <Text className="text-base font-bold text-white">{food.name}</Text>
              <Text className="text-gray-200 mt-1">Origin: {food.origin}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal for Selecting Professional */}
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Professional</Text>

            {/* Show professional details or list of pros */}
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
                  onPress={() => {
                    setShowSchedule(false);
                    setTimeout(() => {
                      setModalVisible(false);
                      setSelectedProfessional(null);
                    }, 300);
                  }}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {professionals.map((prof) => (
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
    alignSelf:  'stretch'
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});