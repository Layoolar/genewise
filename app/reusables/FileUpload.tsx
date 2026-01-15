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
  // Explicitly type the file parameter to ensure it matches DocumentPicker's asset structure
  onFileSelected: (file: DocumentPicker.DocumentPickerAsset | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, onFileSelected }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePickDocument = async () => {
    setLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Accept any file type (e.g., 'image/*', 'application/pdf', 'text/plain')
        copyToCacheDirectory: true, // Copy to cache for easier access (important for Android content URIs)
      });

      // Check if the user selected a document and it's not a cancellation
      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const doc = result.assets[0]; // Get the first selected document asset
        
        // --- START OF ENHANCED LOGGING IN FILEUPLOAD ---
        console.log('--- FileUpload: DocumentPicker Result ---');
        console.log('Selected Document URI:', doc.uri);
        console.log('Selected Document Name:', doc.name);
        console.log('Selected Document MIME Type:', doc.mimeType);
        console.log('Selected Document Size:', doc.size);
        console.log('--- End FileUpload: DocumentPicker Result ---');
        // --- END OF ENHANCED LOGGING IN FILEUPLOAD ---

        // Display the file name, with a fallback if doc.name is null/undefined
        setFileName(doc.name || 'Document Selected'); 
        onFileSelected(doc); // Pass the full document asset object to the parent
      } else {
        // User cancelled document picking or no assets selected
        console.log('Document picking cancelled or no assets selected.');
        setFileName(null); // Clear displayed file name
        onFileSelected(null); // Clear selected file in parent state
      }
    } catch (err) {
      console.error('Error picking document:', err);
      setFileName(null);
      onFileSelected(null);
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
              {fileName || 'Choose a file'} {/* Display chosen file name or default text */}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};
