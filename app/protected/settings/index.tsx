import React, { useContext } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/app/context/AuthContext';
import { showSuccessToast, showErrorToast } from '@/app/utils/toast'; 

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useContext(AuthContext); 


  const handleSettingPress = async (settingName: string) => {
    console.log(`Navigating to/Action for: ${settingName}`);
    switch (settingName) {
      case 'Subscribe to Premium':
        //  router.push('/premium-subscription');
        showSuccessToast('Subscribe to Premium clicked!');
        break;
      case 'Change Password':
        // router.push('/change-password');
        showSuccessToast('Change Password clicked!'); 
        break;
      case 'Delete My Account':
        showErrorToast('Delete My Account clicked!'); 
        break;
      case 'Logout':
        try {
          await signOut(); 
          showSuccessToast('Logged out successfully!');
          setTimeout(() => {
            router.replace('/auth/login'); 
          }, 0);
        } catch (e) {
          console.error('Error during logout:', e);
          showErrorToast('Failed to log out. Please try again.');
        }
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        {/* Header */}
        <View className="rounded-2xl bg-[#1C5403] px-6 py-6 mb-6 shadow-md">
          <Text className="text-white text-2xl font-bold text-center">
            Settings
          </Text>
        </View>

        {/* Settings Options */}
        <View className="space-y-4"> 

          {/* Subscribe to Premium */}
          <TouchableOpacity
            onPress={() => handleSettingPress('Subscribe to Premium')}
            className="flex-row items-center bg-white p-5 rounded-xl shadow-sm border border-gray-200"
            style={styles.settingCard}
          >
            <Ionicons name="star-outline" size={24} color="#1C5403" />
            <Text className="ml-4 text-lg font-semibold text-gray-800 flex-1">
              Subscribe to Premium
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Change Password */}
          <TouchableOpacity
            onPress={() => handleSettingPress('Change Password')}
            className="flex-row items-center bg-white p-5 rounded-xl shadow-sm border border-gray-200"
            style={styles.settingCard}
          >
            <Ionicons name="key-outline" size={24} color="#1C5403" />
            <Text className="ml-4 text-lg font-semibold text-gray-800 flex-1">
              Change Password
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Delete My Account */}
          <TouchableOpacity
            onPress={() => handleSettingPress('Delete My Account')}
            className="flex-row items-center bg-white p-5 rounded-xl shadow-sm border border-gray-200"
            style={styles.settingCard}
          >
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
            <Text className="ml-4 text-lg font-semibold text-red-500 flex-1">
              Delete My Account
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            onPress={() => handleSettingPress('Logout')}
            className="flex-row items-center bg-white p-5 rounded-xl shadow-sm border border-gray-200"
            style={styles.settingCard}
          >
            <Ionicons name="log-out-outline" size={24} color="#6B7280" /> 
            <Text className="ml-4 text-lg font-semibold text-gray-700 flex-1">
              Logout
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  settingCard: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
