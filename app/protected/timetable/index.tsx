import { MealPopup } from '@/app/reusables/Mealpopup';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const mockMealPlan = {
  Monday: ['Fried Rice', 'Moin Moin', 'Goat Meat'],
  Tuesday: ['Yam & Egg Sauce', 'Vegetable Soup', 'Jollof Rice'],
  Wednesday: ['Oatmeal', 'Plantain & Fish', 'Egusi Soup'],
  Thursday: ['Pap & Okra', 'Bread & Tea', 'Amala & Ewedu'],
  Friday: ['Semovita & Banga Soup', 'Rice & Stew', 'Noodles & Chicken'],
  Saturday: ['Breakfast Porridge', 'Spaghetti', 'Grilled Turkey'],
  Sunday: ['Corn Flakes', 'Indomie', 'Beef & Pepper Soup'],
};

const days = Object.keys(mockMealPlan);

export default function Timetable() {
  const router = useRouter();
  const [country, setCountry] = useState('');
  const [tribe, setTribe] = useState('');
  const [generated, setGenerated] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<{ title: string; items: string[] } | null>(null);

  const handleGenerate = () => {
    if (!country.trim()) {
      Alert.alert('Error', 'Please enter your country');
      return;
    }

    // Simulate generation
    setTimeout(() => {
      setGenerated(true);
    }, 300);
  };

  const openMealDetail = (day: string) => {
    const items = mockMealPlan[day as keyof typeof mockMealPlan];
    setSelectedMeal({ title: day, items });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        {/* Header Section */}
        <View className="rounded-2xl bg-[#1C5403] px-6 py-6 mb-6">
          <Text className="text-white text-2xl font-bold mb-2">
            Personalized Meal Timetable
          </Text>
        </View>
          <Text className="text-[17px] text-black-00 mb-6">
            Enter your location and tribe to generate a custom weekly meal plan.
          </Text>
        

        <TextInput
          value={country}
          onChangeText={setCountry}
          placeholder="Enter your country"
          className="border border-gray-300 rounded-lg p-4 mb-4"
        />

        <TextInput
          onChangeText={setTribe}
          placeholder="Tribe (optional)"
          className="border border-gray-300 rounded-lg p-4 mb-6"
        />

        {/* Generate Button */}
        {!generated ? (
          <TouchableOpacity
            onPress={handleGenerate}
            className={`py-4 rounded-xl items-center justify-center ${
              country.trim() ? 'bg-[#1C5403]' : 'bg-gray-300'
            }`}
            disabled={!country.trim()}
          >
            <Text className="text-white font-semibold">Generate Timetable</Text>
          </TouchableOpacity>
        ) : (
          <>
            <View className="mt-8">
              {days.map((day) => (
                <View key={day} className="mb-6">
                  <Text className="font-bold text-base text-gray-700">{day}</Text>
                  <View className="flex-row justify-between mt-2">
                    <TouchableOpacity
                      onPress={() => openMealDetail(day)}
                      className="flex-1 bg-[#1C5403] rounded-lg py-4 items-center justify-center mx-1"
                    >
                      <Text className="text-white font-semibold">Breakfast</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => openMealDetail(day)}
                      className="flex-1 bg-[#1C5403] rounded-lg py-4 items-center justify-center mx-1"
                    >
                      <Text className="text-white font-semibold">Lunch</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => openMealDetail(day)}
                      className="flex-1 bg-[#1C5403] rounded-lg py-4 items-center justify-center mx-1"
                    >
                      <Text className="text-white font-semibold">Dinner</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Meal Modal */}
      {selectedMeal && (
        <MealPopup
          visible={!!selectedMeal}
          onClose={() => setSelectedMeal(null)}
          mealItems={selectedMeal.items}
          title={selectedMeal.title}
        />
      )}
    </KeyboardAvoidingView>
  );
}
