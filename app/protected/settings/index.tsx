import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/app/context/AuthContext'; 
import { showSuccessToast, showErrorToast } from '@/app/utils/toast'; 
import apiClient from '@/app/utils/apiClient'; 

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useContext(AuthContext);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); 

  const handleSettingPress = async (settingName: string) => {
    console.log(`Navigating to/Action for: ${settingName}`);
    switch (settingName) {
      case 'Subscribe to Premium':
        // router.push('/premium-subscription');
        showSuccessToast('Subscribe to Premium clicked!');
        break;
      case 'Change Password':
        router.push('/auth/change-password');
        break;
      case 'Delete My Account':
        setIsDeleteModalVisible(true); 
        break;
      case 'Logout':
        try {
          if (typeof signOut === 'function') {
            await signOut();
            showSuccessToast('Logged out successfully!');
            setTimeout(() => {
              router.replace('/auth/login');
            }, 1000); 
          } else {
            showErrorToast('Logout function not available.');
          }
        } catch (e) {
          console.error('Error during logout:', e);
          showErrorToast('Failed to log out. Please try again.');
        }
        break;
      default:
        break;
    }
  };


  const handleDeleteAccount = async () => {
    setIsDeleteModalVisible(false); 
    try {
      if (!apiClient) {
        throw new Error('API client is not initialized.');
      }
      console.log('Attempting to delete account...');
      const response = await apiClient.delete('/user/');

      if (response.status === 200 || response.status === 204) {
        console.log('Account deleted successfully.');
        showSuccessToast('Account deleted successfully.');

        if (typeof signOut === 'function') {
          await signOut(); 
        }

        setTimeout(() => {
          router.dismissAll(); 
          router.replace('/'); 
        }, 1500);

      } else {
        const errorMessage =
          response.data?.message ||
          `Failed to delete account. Unexpected response status: ${response.status}`;
        console.error('Unexpected response from delete account endpoint:', response);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error deleting account:', error);
      let userFriendlyMessage = 'Failed to delete account. Please try again.';

      if (error.response) {
        console.error('API Error Response Data:', error.response.data);
        console.error('API Error Status:', error.response.status);
        console.error('API Error Headers:', error.response.headers);
        if (error.response.status === 401) {
          userFriendlyMessage = 'You are not authorized. Please log in again.';
        } else if (error.response.status === 403) {
          userFriendlyMessage = 'Access forbidden. Cannot delete account.';
        } else if (error.response.status >= 500) {
          userFriendlyMessage = 'Server error. Please try again later.';
        } else {
          userFriendlyMessage =
            error.response.data?.message ||
            `Server error (${error.response.status}). Please try again.`;
        }
      } else if (error.request) {
        console.error('Network Error - No response received:', error.request);
        userFriendlyMessage = 'Network error. Please check your connection.';
      } else {
        console.error('General Error Message:', error.message);
        userFriendlyMessage = error.message || userFriendlyMessage;
      }

      showErrorToast(userFriendlyMessage);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        {/* Header */}
        <View className="rounded-2xl bg-[#1C5403] px-6 py-6 mb-6 shadow-md">
          <Text className="text-white text-2xl font-bold text-center">Settings</Text>
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

      <Modal
        animationType="fade" 
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => {
          setIsDeleteModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Confirm Account Deletion</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete your account? This action is permanent and cannot be
              undone. All your data will be lost.
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonCancel]}
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <Text style={styles.textStyle}>No, Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonDelete]}
                onPress={handleDeleteAccount} 
              >
                <Text style={styles.textStyle}>Yes, Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  settingCard: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%', 
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    lineHeight: 22, 
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    flex: 0.48, 
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#9CA3AF', 
  },
  buttonDelete: {
    backgroundColor: '#EF4444', 
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});