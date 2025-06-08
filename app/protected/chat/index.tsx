// app/chat/index.tsx

import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Text
} from 'react-native';
import { useRouter } from 'expo-router';


import { ChatMessage } from '../../reusables/ChatMessage';
import { Ionicons } from '@expo/vector-icons';

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
}


export default function ChatScreen() {
   const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, text: 'Hello! How can I help you today?', isUser: false },
  ]);

  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      text: input,
      isUser: true,
    };

    // Add user message
    setMessages((prev) => [...prev, newMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiThinkingMessage: ChatMessage = {
        id: Date.now() + 1,
        text: "I'm thinking...",
        isUser: false,
      };

      setMessages((prev) => [...prev, aiThinkingMessage]);
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 500);

    // Simulate real AI reply after delay
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.text === "I'm thinking..." && !msg.isUser
            ? { ...msg, text: 'Here’s how I can assist...' }
            : msg
        )
      );
    }, 1500);
  };


  return (
    <View className="flex-1 bg-white">
    <View className="bg-[#1C5403] flex-row items-center px-4 pt-12 pb-6">
      <TouchableOpacity onPress={() => router.back()} className="mr-3">
       <Ionicons name="arrow-back" size={24} color="white" />
     </TouchableOpacity>
    <Image
       source={require('../../../assets/images/genewiser1.png')}
       className="w-10 h-10 rounded-full"
       resizeMode="contain"
     />
    <View className="ml-3 justify-center">
      <Text className="text-white font-bold text-base">GenWise AI</Text>
      <Text className="text-gray-200 text-xs">Online</Text>
     </View>
    </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ChatMessage text={item.text} isUser={item.isUser} />
        )}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-400">No messages yet</Text>
          </View>
        }
      />

      {/* Input Field */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
        className="border-t border-gray-200 bg-white px-4 py-3"
      >
        <View className="flex-row items-center">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-3"
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!input.trim()}
            className={`ml-2 p-3 rounded-full ${
              input.trim() ? 'bg-[#1C5403]' : 'bg-gray-300'
            }`}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}