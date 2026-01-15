import { MealPopup } from '@/app/reusables/Mealpopup';
import React, { useState, useContext, useEffect } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import apiClient from '@/app/utils/apiClient';
import { showSuccessToast, showErrorToast } from '@/app/utils/toast';
import { AuthContext } from '@/app/context/AuthContext';


interface FoodItemResponse {
    id: string;
    user_id: string;
    name: string;
    origin: string;
    day_of_week: string;
    meal: 'Breakfast' | 'Lunch' | 'Dinner';
}

interface MealPlanDisplay {
    [day: string]: (FoodItemResponse | null)[];
}


export default function Timetable() {
    const { user, isLoading: authLoading } = useContext(AuthContext);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedMealPlan, setGeneratedMealPlan] = useState < MealPlanDisplay | null > (null);
    const [selectedMeal, setSelectedMeal] = useState < { title: string; mealItem: FoodItemResponse } | null > (null);
    const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);


    const processFoodItemsToMealPlan = (foodItems: FoodItemResponse[]): MealPlanDisplay => {
        const plan: MealPlanDisplay = {
            Monday: [null, null, null], Tuesday: [null, null, null], Wednesday: [null, null, null],
            Thursday: [null, null, null], Friday: [null, null, null], Saturday: [null, null, null],
            Sunday: [null, null, null]
        };

        foodItems.forEach(item => {
            const day = typeof item.day_of_week === 'string'
                ? item.day_of_week.charAt(0).toUpperCase() + item.day_of_week.slice(1)
                : '';

            if (plan[day]) {
                const mealIndex = typeof item.meal === 'string'
                    ? ['Breakfast', 'Lunch', 'Dinner'].indexOf(item.meal)
                    : -1;

                if (mealIndex !== -1) {
                    plan[day][mealIndex] = item;
                } else {
                    console.warn(`Unexpected mealType for ${item.name} on ${item.day_of_week}: ${item.meal}`);
                }
            } else {
                console.warn(`Unexpected day_of_week for ${item.name}: ${item.day_of_week}`);
            }
        });
        return plan;
    };

    const fetchExistingMealPlan = async () => {
        if (authLoading || !user || !user.id) {
            console.log("Skipping fetchExistingMealPlan: Auth loading or user not available.");
            return;
        }
        if (!apiClient) {
          showErrorToast('API client not initialized. Please try again later.');
          setIsGenerating(false);
           return;
         }

        setIsGenerating(true);
        setInitialLoadAttempted(true);

        try {
            const response = await apiClient.get('/foods/');
            console.log("Response from GET /foods/:", response.data);

            if (response.status === 200 && response.data && Array.isArray(response.data.data)) {
                if (response.data.data.length > 0) {
                    showSuccessToast("Existing meal plan loaded!");
                    const processedPlan = processFoodItemsToMealPlan(response.data.data);
                    setGeneratedMealPlan(processedPlan);
                } else {
                    console.log("GET /foods/ returned empty data. No existing meal plan found for user.");
                    setGeneratedMealPlan(null);
                }
            } else {
                console.log("Unexpected response structure from GET /foods/:", response.data);
                showErrorToast(response.data?.message || 'Failed to load existing meal plan. Unexpected response.');
                setGeneratedMealPlan(null);
            }
        } catch (error: any) {
            console.error('Error fetching existing meal plan (GET /foods/):', error.response?.data || error.message);
            if (error.response?.status === 404 || error.response?.status === 204) {
                console.log("Server indicated no existing meal plan (e.g., 404/204).");
                setGeneratedMealPlan(null);
            } else {
                showErrorToast(error.response?.data?.message || 'Failed to load existing meal plan. Please try again.');
                setGeneratedMealPlan(null);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user && user.id && !initialLoadAttempted) {
            fetchExistingMealPlan();
        }
    }, [authLoading, user, initialLoadAttempted]);


    const handleGenerateInitialTimetable = async () => {
        if (!apiClient) {
           showErrorToast('API client not initialized. Please try again later.');
           setIsGenerating(false);
          return;
        }
        if (authLoading) {
            showErrorToast("Authenticating.... please wait.");
            return;
        }
        if (!user || !user.id) {
            showErrorToast("User not logged in. Please log in to generate a timetable.");
            return;
        }
        // Validate country from user object in AuthContext
        if (!user.country || !user.country.trim()) {
            showErrorToast('Your country is not set in your profile. Please complete onboarding or update your profile.');
            return;
        }

        setIsGenerating(true);
        setGeneratedMealPlan(null);

        try {
            const response = await apiClient.post('/foods/', {
                country: user.country,
                tribe: user.tribe,    
            });

            if (response.status === 200 && response.data && Array.isArray(response.data.data)) {
                showSuccessToast('Meal Plan generated successfully!');
                console.log('Generated meal plan data:', response.data.data);
                const processedPlan = processFoodItemsToMealPlan(response.data.data);
                setGeneratedMealPlan(processedPlan);
            } else {
                showErrorToast(response.data?.message || 'Failed to generate meal plan. Unexpected response format.');
            }
        } catch (error: any) {
            console.error('Error during initial meal plan generation (POST /foods/):', error.response?.data || error.message);
            if (error.response?.status === 409 && error.response.data?.message) {
                showErrorToast(`Generation failed: ${error.response.data.message}. You already have a timetable. Please use 'Regenerate Full Timetable' or regenerate individual meals.`);
                fetchExistingMealPlan();
            } else {
                showErrorToast(error.response?.data?.message || 'An error occurred during generation. Please try again.');
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRegenerateFullTimetable = async () => {
        if (authLoading) {
            showErrorToast("Authenticating.... please wait.");
            return;
        }
        if (!user || !user.id) {
            showErrorToast("User not logged in. Please log in to regenerate a timetable.");
            return;
        }
        // Validate country from user object in AuthContext
        if (!user.country || !user.country.trim()) {
            showErrorToast('Your country is not set in your profile. Please update your profile.');
            return;
        }

        if (!apiClient) {
        showErrorToast('API client not initialized. Please try again later.');
         setIsGenerating(false);
         return;
        }

        setIsGenerating(true);
        setGeneratedMealPlan(null);

        try {
            const response = await apiClient.post('/foods/regenerate', {
                country: user.country,
                tribe: user.tribe,     
            }, {
                timeout: 30000,
            });

            if (response.status === 200 && response.data && Array.isArray(response.data.data)) {
                showSuccessToast('Full timetable regenerated successfully!');
                console.log('Regenerated full meal plan data:', response.data.data);
                const processedPlan = processFoodItemsToMealPlan(response.data.data);
                setGeneratedMealPlan(processedPlan);
            } else {
                showErrorToast(response.data?.message || 'Failed to regenerate full meal plan. Unexpected response format.');
            }
        } catch (error: any) {
            console.error('Error during full meal plan regeneration (POST /foods/regenerate):', error.response?.data || error.message);
            if (error.response?.status === 404 && error.response.data?.message?.includes("no existing foods found for user")) {
                showErrorToast("No existing timetable found for regeneration. Please use 'Generate Timetable' to create a new one.");
                setGeneratedMealPlan(null);
            } else {
                showErrorToast(error.response?.data?.message || 'An error occurred during full regeneration. Please try again.');
            }
        } finally {
            setIsGenerating(false);
        }
    };


    const handleRegenerateSingleMeal = async (mealToRegenerate: FoodItemResponse) => {
        if (authLoading) {
            showErrorToast("Authenticating... please wait.");
            return;
        }
        if (!user || !user.id) {
            showErrorToast("User not logged in. Cannot regenerate meal.");
            return;
        }

        if (!apiClient) {
         showErrorToast('API client not initialized. Please try again later.');
         setIsGenerating(false);
         return;
        }
        setIsGenerating(true);

        try {
            if (!mealToRegenerate.id || typeof mealToRegenerate.id !== 'string') {
                showErrorToast("Missing or invalid meal ID for regeneration.");
                setIsGenerating(false);
                return;
            }

            const response = await apiClient.post('/foods/review', {
                food_ids: [mealToRegenerate.id], 
            });

            if (response.status === 200 && response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
                showSuccessToast('Meal regenerated successfully!');
                console.log('Regenerated single meal data (from /foods/review):', response.data.data);

                const newMealItem: FoodItemResponse = response.data.data[0]; 

                setGeneratedMealPlan(prevPlan => {
                    if (!prevPlan) return null;

                    const updatedPlan = { ...prevPlan };
                    const day = typeof newMealItem.day_of_week === 'string'
                        ? newMealItem.day_of_week.charAt(0).toUpperCase() + newMealItem.day_of_week.slice(1)
                        : '';
                    const mealIndex = typeof newMealItem.meal === 'string'
                        ? ['Breakfast', 'Lunch', 'Dinner'].indexOf(newMealItem.meal)
                        : -1;

                    if (updatedPlan[day] && mealIndex !== -1) {
                        updatedPlan[day][mealIndex] = newMealItem;
                    } else {
                        console.warn("Could not update meal plan with regenerated item due to unexpected data:", newMealItem);
                    }
                    return updatedPlan;
                });

                setSelectedMeal(null);

            } else {
                showErrorToast(response.data?.message || 'Failed to regenerate meal. Unexpected response format from /foods/review.');
            }
        } catch (error: any) {
            console.error('Error during single meal regeneration (POST /foods/review):', error.response?.data || error.message);
            showErrorToast(error.response?.data?.message || 'An error occurred during regeneration. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };


    const days = generatedMealPlan ? Object.keys(generatedMealPlan) : [];

    const openMealDetail = (day: string, mealIndex: number) => {
        if (generatedMealPlan && generatedMealPlan[day] && generatedMealPlan[day][mealIndex]) {
            const mealItem = generatedMealPlan[day][mealIndex];
            if (mealItem && mealItem.name !== 'N/A') {
                const mealType = ['Breakfast', 'Lunch', 'Dinner'][mealIndex];
                setSelectedMeal({ title: `${day} - ${mealType}`, mealItem: mealItem });
            } else {
                showErrorToast('No meal details available for this slot.');
            }
        } else {
            showErrorToast('No meal details available for this slot.');
        }
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
                    {generatedMealPlan
                        ? 'Your weekly meal plan:'
                        : 'Generate your custom weekly meal plan based on your profile country and tribe.'
                    }
                </Text>


                {(isGenerating || authLoading) && (
                    <View className="py-4 items-center justify-center">
                        <ActivityIndicator size="large" color="#1C5403" />
                        <Text className="text-gray-600 mt-2">
                            {authLoading ? "Loading user data..." : "Processing request..."}
                        </Text>
                    </View>
                )}

                {/* "Generate Timetable" button: Show ONLY if no timetable is loaded AND not currently loading */}
                {!generatedMealPlan && !isGenerating && !authLoading && (
                    <TouchableOpacity
                        onPress={handleGenerateInitialTimetable}
                        className={`py-4 rounded-xl items-center justify-center ${user?.country?.trim() ? 'bg-[#1C5403]' : 'bg-gray-300'
                            }`}
                        disabled={!user?.country?.trim()} 
                    >
                        <Text className="text-white font-semibold">Generate Timetable</Text>
                    </TouchableOpacity>
                )}


                {generatedMealPlan && !isGenerating && !authLoading && (
                    <TouchableOpacity
                        onPress={handleRegenerateFullTimetable}
                        className={`py-4 rounded-xl items-center justify-center mt-8 ${user?.country?.trim() ? 'bg-[#1C5403]' : 'bg-gray-300'
                            }`}
                        disabled={!user?.country?.trim()} 
                    >
                        <Text className="text-white font-semibold">Regenerate Full Timetable</Text>
                    </TouchableOpacity>
                )}

                {generatedMealPlan && (
                    <>
                        <View className="mt-8">
                            {days.map((day) => (
                                <View key={day} className="mb-6">
                                    <Text className="font-bold text-base text-gray-700">{day}</Text>
                                    <View className="flex-row justify-between mt-2">
                                        {/* Breakfast Button */}
                                        <TouchableOpacity
                                            onPress={() => openMealDetail(day, 0)}
                                            className="flex-1 bg-[#1C5403] rounded-lg py-4 items-center justify-center mx-1"
                                        >
                                            <Text className="text-white font-semibold">Breakfast</Text>
                                        </TouchableOpacity>

                                        {/* Lunch Button */}
                                        <TouchableOpacity
                                            onPress={() => openMealDetail(day, 1)}
                                            className="flex-1 bg-[#1C5403] rounded-lg py-4 items-center justify-center mx-1"
                                        >
                                            <Text className="text-white font-semibold">Lunch</Text>
                                        </TouchableOpacity>

                                        {/* Dinner Button */}
                                        <TouchableOpacity
                                            onPress={() => openMealDetail(day, 2)}
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
                    mealItems={[selectedMeal.mealItem.name]}
                    title={selectedMeal.title}
                    onRegenerate={() => handleRegenerateSingleMeal(selectedMeal.mealItem)}
                    isRegenerating={isGenerating}
                />
            )}
        </KeyboardAvoidingView>
    );
}
