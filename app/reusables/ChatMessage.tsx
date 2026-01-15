import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet} from 'react-native';

interface ChatMessageProps {
  text: string;
  isUser: boolean;
  loading?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ text, isUser, loading }) => {
  return (
    <View
      className={`mx-4 my-2 ${isUser ? 'items-end' : 'items-start'}`}
    >
      <View
        className={`max-w-[75%] p-4 rounded-xl ${
          isUser ? 'bg-[#1C5403]' : 'bg-black'
        }`}
        style={styles.shadow}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
             <ActivityIndicator size="small" color="white" />
             <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        ): (
          <Text className="text-white text-base">{text}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  loadingText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  }
})