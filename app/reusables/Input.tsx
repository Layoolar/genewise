// components/Input.tsx

import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Label } from './Label';

interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: string;
  onBlur?: () => void;
  touched?: boolean;
  inputStyle?: object;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  onBlur,
  touched = false,
  inputStyle 
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className="mb-4">
      {/* Label */}
      <Label text={label} />

      {/* Input Wrapper */}
      <View className="flex-row items-center border-b border-gray-200 py-3">
        <TextInput
          className="flex-1 text-base"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onBlur={onBlur}
          style={inputStyle}
        />

        {/* Eye Icon for Password Toggle */}
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <MaterialIcons
              name={isPasswordVisible ? 'visibility' : 'visibility-off'}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        )}

        {/* Checkmark when input is filled */}
        {value.length > 0 && !secureTextEntry && (
          <MaterialIcons name="check" size={20} color="gray" />
        )}
      </View>

      {/* Error Message */}
      {touched && error && (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      )}
    </View>
  );
};