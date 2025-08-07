import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useSegments, Slot, Stack } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedLayout() {
  const router = useRouter();
  const segments = useSegments();
  const {token, user, isLoading} = useAuth();

  useEffect(() => {
    if (!isLoading) {
       if (!token || !user) {
        console.log("ProtectedLayout: No token or user, redirecting to login.");
        router.replace('/auth/login');
       } else if (!user.is_verified) {
         console.log("ProtectedLayout: User not verified, redirecting to verify.");
         router.replace('/auth/verify');
       }
    }
  }, [isLoading, token, user, router]);

  if (isLoading) {
     return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1C5403" />
        <Text className="mt-2 text-gray-600">Loading...</Text>
      </View>
     );
  }

 
  if (!token || !user) {
     return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Redirecting to login...</Text>
      </View>
    );
  }

  if (!user.is_verified) {
     return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Redirecting to verification...</Text>
      </View>
    );
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
    {
      label: 'Settings',
      icon: <Feather name="settings" size={24} color="#1C5403" />,
      route: '/protected/settings'
    }
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
          const isActive = segments[0] === item.route.split('/').pop(); 

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