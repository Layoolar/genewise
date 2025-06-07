import React from 'react';
import { View, Text } from 'react-native';

interface ChatMessageProps {
  text: string;
  isUser: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ text, isUser }) => {
  return (
    <View
      className={`mx-4 my-2 ${isUser ? 'items-end' : 'items-start'}`}
    >
      <View
        className={`max-w-[75%] p-4 rounded-xl ${
          isUser ? 'bg-[#1C5403]' : 'bg-black'
        }`}
      >
        <Text className="text-white text-base">{text}</Text>
      </View>
    </View>
  );
};