import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useSegments, Slot, Stack } from 'expo-router'; // <-- Use Slot instead of Outlet
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedLayout() {
  const router = useRouter();
  const segments = useSegments();
  const {token, user, isLoading} = useAuth();

  // Show nothing while loading auth state 
  if (isLoading) {
    return <Text>Loading...</Text>
  }

  // If not token, redirect to login
  if (!token || !user) {
    router.replace('/auth/login');
    return null;
  }

  // If user exists but not veirfied, redirect to verify screen 
  if (!user.is_verified) {
    router.replace('/auth/verify');
    return null;
  }

  const navItems = [
    {
      label: 'Foods',
      icon: <Ionicons name="heart" size={24} color="#1C5403" />,
      route: '/protected/foods',
    },
     {
      label: 'Timetable',
      icon: <Ionicons name="time" size={24} color="#1C5403" />,
      route: '/protected/timetable',
    },
    {
      label: 'AI chat',
      icon: <Ionicons name="chatbubbles" size={24} color="#1C5403" />,
      route: '/protected/chat',
    },
    {
      label: 'Profile',
      icon: <Ionicons name="person" size={24} color="#1C5403" />,
      route: '/protected/profile',
    },
  ];

  return (
    <>
     <Stack.Screen options={{ headerShown: false }} />
     
      <View className="flex-1">
        <Slot /> 
      </View>

      {/* Bottom Nav Bar */}
      <View className="h-16 flex-row bg-white border-t border-gray-200 shadow-md">
        {navItems.map((item, index) => {
          const isActive = segments[0] === item.route.split('/').pop(); // e.g., 'dashboard'

          return (
            <TouchableOpacity
              key={index}
              className="flex-1 items-center justify-center"
              onPress={() => router.push(item.route)}
            >
              <View className="items-center justify-center">
                {item.icon}
                <Text
                  className={`text-xs mt-1 ${
                    isActive ? 'text-[#1C5403] font-bold' : 'text-gray-500'
                  }`}
                >
                  {isActive ? '•' : item.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}