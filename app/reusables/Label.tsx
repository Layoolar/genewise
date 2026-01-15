import React from 'react';
import { Text } from 'react-native'

interface LabelProps {
    text: string;
    className?: string;
}


export const Label: React.FC<LabelProps> = ({ text, className = '' }) => {
    return (
      <Text className={`text-sm font-medium text-gray-700 mb-1 ${className}`}>
        {text}
      </Text>
    );
};