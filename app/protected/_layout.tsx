// app/protected/_layout.tsx

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useSegments, Slot, Stack } from 'expo-router'; // <-- Use Slot instead of Outlet
import { Ionicons } from '@expo/vector-icons';

export default function ProtectedLayout() {
  const router = useRouter();
  const segments = useSegments();

  const navItems = [
    {
      label: 'Dashboard',
      icon: <Ionicons name="heart" size={24} color="#1C5403" />,
      route: '/protected/dashboard',
    },
    {
      label: 'Chat',
      icon: <Ionicons name="chatbubbles" size={24} color="#1C5403" />,
      route: '/protected/chat',
    },
    {
      label: 'Profile',
      icon: <Ionicons name="person" size={24} color="#1C5403" />,
      route: '/protected/profile',
    },
    {
      label: 'History',
      icon: <Ionicons name="time" size={24} color="#1C5403" />,
      route: '/protected/history',
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