import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Text,
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChatMessage } from '../../reusables/ChatMessage'; 
import { Ionicons } from '@expo/vector-icons';
import { showErrorToast } from '../../utils/toast'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 



interface Message {
  id: number;
  text: string;
  isUser: boolean;
  loading?: boolean; 
}

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hello! How can I help you today?', isUser: false },
  ]);
  const [isSending, setIsSending] = useState(false); 
  const [isAITyping, setIsAITyping] = useState(false);

  const flatListRef = useRef<FlatList<Message>>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const sendMessage = async () => {
    if (!input.trim() || isSending || isAITyping) return; 

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput(''); 
    setIsSending(true); 

    const aiPlaceholderId = Date.now() + 1;
    setMessages((prev) => [
      ...prev,
      { id: aiPlaceholderId, text: '', isUser: false, loading: true },
    ]);
    setIsAITyping(true); 

    setTimeout(scrollToBottom, 100); 

    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const response = await fetch('https://api.veloraos.xyz/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

  
      console.log('--- Full Response Object for Debugging ---');
      console.log('Response Status:', response.status);
      console.log('Response Status Text:', response.statusText);
      console.log('Response Headers (Content-Type):', response.headers.get('Content-Type'));
      console.log('Response Body (before getReader):', response.body);
      console.log('-----------------------------------------');

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      if (!response.body) {
        let nonStreamingContent = "No streamable response body received.";
        try {
          const textResult = await response.text(); 
          if (textResult.trim()) {
            nonStreamingContent = `Received non-streaming content: "${textResult.trim()}"`;
          } else {
            nonStreamingContent = "Response body was empty (non-streaming).";
          }
        } catch (e) {
          nonStreamingContent = `Could not read response body as text: ${e}`;
        }

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === aiPlaceholderId
              ? { ...msg, text: `AI Chat Error: Failed to get readable stream reader. The server responded with HTTP ${response.status} and 'text/event-stream' but provided no streamable body. Diagnostic: ${nonStreamingContent}. This is a backend implementation issue.`, loading: false }
              : msg
          )
        );
        scrollToBottom();
        setIsAITyping(false);
        setIsSending(false);
        showErrorToast("AI chat stream failed. Please contact support.");
        return; 
      }
      const reader = response.body.getReader(); 
      const decoder = new TextDecoder();
      let accumulatedText = '';

      const readStream = async () => {
        const { done, value } = await reader.read();
        if (done) {
          console.log('Stream complete');
          return;
        }

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === aiPlaceholderId
              ? { ...msg, text: accumulatedText, loading: false } 
              : msg
          )
        );
        scrollToBottom(); 

        await readStream(); 
      };

      await readStream(); 

    } catch (error: any) {
      console.error('Error sending message to AI:', error);
      showErrorToast(error.message || 'Failed to get response from AI. Please try again.');

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === aiPlaceholderId
            ? { ...msg, text: `Error: ${error.message || 'Failed to get response'}`, loading: false }
            : msg
        )
      );
      scrollToBottom();
    } finally {
      setIsSending(false);
      setIsAITyping(false); 
    }
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

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ChatMessage text={item.text} isUser={item.isUser} loading={item.loading} />
        )}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} 
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-400">No messages yet</Text>
          </View>
        }
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom} 
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} 
        className="border-t border-gray-200 bg-white px-4 py-3"
      >
        <View className="flex-row items-center">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-3"
            editable={!isSending && !isAITyping} 
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!input.trim() || isSending || isAITyping} 
            className={`ml-2 p-3 rounded-full ${
              !input.trim() || isSending || isAITyping ? 'bg-gray-300' : 'bg-[#1C5403]'
            }`}
          >
            {isSending || isAITyping ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}