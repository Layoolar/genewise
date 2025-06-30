import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator, 
} from 'react-native';

interface MealPopupProps {
  visible: boolean;
  onClose: () => void;
  mealItems: string[];
  title: string;
  onRegenerate: () => void; 
  isRegenerating: boolean;  
}

export const MealPopup: React.FC<MealPopupProps> = ({
  visible,
  onClose,
  mealItems,
  title,
  onRegenerate, 
  isRegenerating,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.mealList}>
            {mealItems.map((item, idx) => (
              <View key={idx} style={styles.mealItem}>
                <Text>{item}</Text>
              </View>
            ))}
          </View> 
          <TouchableOpacity
            style={[styles.button, styles.buttonRegenerate]}
            onPress={onRegenerate}
            disabled={isRegenerating} 
          >
            {isRegenerating ? (
              <ActivityIndicator color="#fff" /> 
            ) : (
              <Text style={styles.buttonText}>Regenerate This Meal</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center', 
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333', 
  },
  mealList: {
    gap: 8,
    width: '100%',
  },
  mealItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  button: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%', 
  },
  buttonRegenerate: {
    backgroundColor: '#1C5403',
  },
  closeButton: {
    backgroundColor: '#f44336', 
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
