import React, { useState } from 'react';
import { 
    View, 
    Text,
    TouchableOpacity,
    Modal, 
    FlatList
} from 'react-native';

interface DropdownProps {
    label: string;
    options: string[];
    selectedValue: string | null;
    onValueChange: (value: string) => void;
    error?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
    label,
    options,
    selectedValue,
    onValueChange,
    error,
}) => {
  const [isVisible, setIsVisible] = useState(false);

   return (
     <View className="mb-4">
        <Text className="text-[#1C5403] font-bold text-base">{label}</Text>
        <TouchableOpacity
          onPress={() => setIsVisible(true)}
          className={`border border-gray-300 rounded-lg p-3 mt-1 ${
            error ? ' border-red-500' : ''
          }`}>
           <Text>{selectedValue || 'Select an option'}</Text>
        </TouchableOpacity>

        <Modal visible={isVisible} transparent animationType="slide">
          <View className="flex-1 justify-center bg-black/30">
            <View className="bg-white mx-6 rounded-xl overflow-hidden">
              <FlatList
                 data={options}
                 keyExtractor={(item) => item}
                 renderItem={({ item }) => (
                   <TouchableOpacity 
                     className="p-4 border-b border-gray-200"
                     onPress={() => {
                        onValueChange(item);
                        setIsVisible(false);
                     }}>
                      <Text>{item}</Text>
                   </TouchableOpacity>
                 )}
              />
              <TouchableOpacity
                className="p-4 bg-gray-200"
                onPress={() => setIsVisible(false)}>
                 <Text className="text-center">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
     </View>
   );
};