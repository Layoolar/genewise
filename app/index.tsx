import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';

const {width, height} = Dimensions.get('window');


interface ButtonProps {
  title: string;
  onPress: () => void;
  accessibilityLabel?: string;
}


const PrimaryButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  accessibilityLabel,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="bg-[#1C5403] py-4 px-8 rounded-xl w-full max-w-xs items-center shadow-md"
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
    >
      <Text className="text-white text-lg font-semibold">{title}</Text>
    </TouchableOpacity>
  );
};


export default function SplashScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white justify-between items-center pt-16 pb-12 px-6">
      <View className="flex-1 justify-center items-center w-full">
        <Image
          source={require('@/assets/images/genwiser.png')}
          style={{
          height: height * 0.5,
          width: width * 0.9,
          resizeMode: 'contain',
          }}
          accessible={true}
          accessibilityLabel="App Logo"
        />
      </View>

      <View className="w-full items-center space-y-4">
        <Text className="text-2xl font-bold text-gray-800 text-center">
          Welcome to Genewise
        </Text>

        <Text className="text-sm text-gray-500 text-center mb-4 px-2">
          Your journey starts here. Sign up now and get started!
        </Text>

        <PrimaryButton
          title="Get Started"
          onPress={() => router.push('/auth/signup')}
          accessibilityLabel="Navigate to sign up page"
        />
      </View>
    </View>
  );
}