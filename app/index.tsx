import React from 'react';
import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';


//Types 
interface ButtonProps {
    title: string;
    onPress: () => void;
    accessibilityLabel?: string;
}

export default function RootLayout()  {

    return (
        <View className="flex-1 bg-white justify-center items-center px-6">
        <Image 
          source={require("../assets/images/genwiser.png")}
          className="w-80 h-80  mb-10"
        />
        <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
           Welcome to Genwise       
        </Text>

        <Text className="text-base text-gray-500 text-center mb-5 px-4">
           Your journey starts here. Sign up now and get started!
        </Text>

        <TouchableOpacity
        activeOpacity={0.8}
        className="bg-[#1C5403] py-4 px-8 rounded-xl w-full max-w-xs items-center shadow-md"
      >
        <Text className="text-white text-lg font-semibold">Get Started</Text>
      </TouchableOpacity>
      </View>
      
    );
}