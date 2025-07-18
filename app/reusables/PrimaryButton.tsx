import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface ButtonProps {
  title: React.ReactNode; 
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  className = '',
}) => {
  return (
    <View
      className={`w-full max-w-xs mx-auto ${className}`}
      style={{
        overflow: 'hidden',
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled || loading}
        style={{
          height: 52,
          overflow: 'hidden',
        }}
        className="items-center justify-center rounded-xl"
      >
        <LinearGradient
          colors={['#1C5403', '#020d00']}
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 16,
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {/* Render title directly, as it can now be a string or a component */}
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-semibold">{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};