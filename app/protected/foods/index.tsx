import React from 'react';
import { 
 View, 
 Text,
 ScrollView,
 TouchableOpacity,
 Image,
 KeyboardAvoidingView,
 Platform
 } from 'react-native';
 import { useRouter } from 'expo-router';


export default function Foods() {
  const router = useRouter();

   const foods = [
    {
      name: 'Red Meat',
      origin: 'Cow, Sheep, Goat',
      image: 'https://images.pexels.com/photos/6287544/pexels-photo-6287544.jpeg'
    },
    {
      name: 'Moin Moin',
      origin: 'African',
      image: 'https://www.seriouseats.com/thmb/FyrplS03gmSGkFlRtc5WuqMp5YY%3D/1500x0/filters%3Ano_upscale%28%29%3Amax_bytes%28150000%29%3Astrip_icc%28%29/20230111-Moin-Moin-Maureen-Celestine-hero-5c656cbc3b684be1b1f29414f2bdc29c.JPG'
    },
    {
      name: 'Fried Rice',
      origin: 'Worldwide',
      image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg'
    },
    {
     name: 'Egusi Soup',
     origin: 'Nigeria',
     image: 'https://kikifoodies.com/wp-content/uploads/2024/12/IMG_4537.jpeg'
    },
    {
     name: 'Jollof Rice',
     origin: 'West Africa',
     image: 'https://voicesofafrica.co.za/wp-content/uploads/2013/03/Party-Jollof-rice.jpg'
    },
    {
     name: 'Oatmeal',
     origin: 'Europe',
     image: 'https://sdmntprukwest.oaiusercontent.com/files/00000000-552c-6243-a562-718e79fd4a72/raw?se=2025-06-11T09%3A56%3A12Z&sp=r&sv=2024-08-04&sr=b&scid=6f355c54-3c6c-5946-b83e-1c7c8e0f5d73&skoid=82a3371f-2f6c-4f81-8a78-2701b362559b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-11T06%3A08%3A17Z&ske=2025-06-12T06%3A08%3A17Z&sks=b&skv=2024-08-04&sig=nY9RA6BArPY1/lbLlSXIiiq0gtC3BN%2BavVDjI3GwaSE%3D'
    },
    {
     name: 'Yam & Egg Sauce',
     origin: 'Nigeria',
     image: 'https://sdmntprnortheu.oaiusercontent.com/files/00000000-6274-61f4-92ac-a229a17aa0da/raw?se=2025-06-11T09%3A54%3A15Z&sp=r&sv=2024-08-04&sr=b&scid=a55d34f8-86a5-5202-ab4a-6a2d6855c505&skoid=82a3371f-2f6c-4f81-8a78-2701b362559b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-11T07%3A17%3A17Z&ske=2025-06-12T07%3A17%3A17Z&sks=b&skv=2024-08-04&sig=WiYt0/5bYuh/UD5/eSdUqG5hlWKd6bHxONFXA4IqsZU%3D'
    },
    {
     name: 'Vegetable Soup',
     origin: 'Worldwide',
     image: 'https://www.dashofjazz.com/wp-content/uploads/2024/03/Dash-of-Jazz-Efo-Elegusi-26-500x500.jpg'
    }
   ]

    return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
       className="flex-1 bg-white">
         <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24}}>
         {/* Header Button */ }
         <TouchableOpacity className="bg-[#1C5403] py-4 rounded-xl items-center justify-center mb-6">
             <Text className="text-white font-bold">Talk to a Professional</Text>
         </TouchableOpacity>

         {/* Food List */ }
         {foods.map((food, index) => (
           <View 
             key={index}
             className="flex-row items-center bg-[#1C5403] p-4 rounded-lg mb-4 overflow-hidden shadow-md">
              {/* Food Image */ }
              <Image
                source={{ uri: food.image }}
                className="w-20 h-20 rounded-md"
                resizeMode="cover"
              />

              {/* Food Details */ }
              <View className="ml-4 flex-1">
                <Text className="text-base font-bold text-white">{food.name}</Text>
                <Text className="text-gray-200 mt-1">Origin: {food.origin}</Text>
              </View>
           </View>
         ))}
      </ScrollView>
    </KeyboardAvoidingView>
    );
}