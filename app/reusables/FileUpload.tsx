import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';

interface FileUploadProps {
  label: string;
  onFileSelected: (file: DocumentPicker.DocumentPickerAsset | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, onFileSelected }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePickDocument = async () => {
    setLoading(true);
    try {
      const doc = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      }).result;

      if (doc?.uri) {
        setFileName(doc.name || 'Document Selected');
        onFileSelected(doc);
      }
    } catch (err) {
      console.error('Error picking document:', err);
      setFileName(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mb-4">
      {/* Label */}
      <Text className="text-[#1C5403] font-bold text-base">{label}</Text>

      {/* Upload Button */}
      <TouchableOpacity
        onPress={handlePickDocument}
        disabled={loading}
        className="flex-row items-center justify-center border border-gray-300 rounded-lg p-3 mt-2 bg-gray-50"
      >
        {loading ? (
          <ActivityIndicator color="#1C5403" />
        ) : (
          <>
            <Ionicons name="document-outline" size={20} color="#1C5403" />
            <Text className="ml-2 text-[#1C5403] font-medium">
              {fileName || 'Choose a file'}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};