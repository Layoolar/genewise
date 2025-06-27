import React, { useState, useRef } from 'react';
import { View, TextInput, Text } from 'react-native';

interface OtpInputProps {
    numberOfDigits?: number;
    onCodeFilled: (code: string) => void;
    error?: string;
    touched?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
    numberOfDigits = 6,
    onCodeFilled,
    error,
    touched = false
}) => {
   const [code, setCode] = useState<string[]>(Array(numberOfDigits).fill(''));
   const inputsRef = useRef<TextInput[]>([]);

   const handleChange = (text: string, index: number) => {
     if (!/^[0-9]*$/.test(text)) return;

     const newCode = [...code];
     newCode[index] = text;
     setCode(newCode);

     // Auto-focus next input 
     if (text && index < numberOfDigits - 1) {
      inputsRef.current[index + 1]?.focus();
     }

     const fullCode = newCode.join('');
     if (fullCode.length === numberOfDigits) {
        onCodeFilled(fullCode);
     }
   };

   const handleKeyPress = (e: any, index: number) => {
     if (e.nativeEvent.key ===  'Backspace' && !code[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
     }
   }
   return (
    <View className="items-center">
      <View className="flex-row justify-between w-4/5 mb-6">
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputsRef.current[index] = ref as TextInput)}
            className={`w-12 h-14 border rounded-md text-center text-xl font-semibold ${
                error ? 'border-red-500' : 'border-gray-300'
            }`}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
          />
        ))}
        {touched && error && (
           <Text className="text-red-500 text-sm">{error}</Text>
        )}
      </View>
    </View>
   )
}