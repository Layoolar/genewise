import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

interface FileUploadProps {
   label: string;
   onFileSelected: (file: DocumentPicker.DocumentPickerAsset | null) => void;
}


export const FileUpload: React.FC<FileUploadProps> = ({ label, onFileSelected }) => {
    const [fileName, setFileName] = useState<string | null>(null);

    const handlePickDocument  = async () => {
        try {
          const doc = await DocumentPicker.getDocumentAsync({
            type: '*/*',
            copyToCacheDirectory: true,
          }).result;

          if (doc?.uri) {
            setFileName(doc.name || "Document Selected");
            onFileSelected(doc);
          }
        } catch (err) {
          console.error('Error picking document:', err);
        }
    }

    return (
      <View className="mb-4">
        <Text className="text-[#1C5403] font-bold text-base">{label}</Text>
        <TouchableOpacity
          onPress={handlePickDocument}
          className="border border-gray-300 rounded-lg p-3 mt-1">
            <Text className="text-gray-300">
              {fileName || 'Choose a file'}
            </Text>
        </TouchableOpacity>
      </View>
    )
}