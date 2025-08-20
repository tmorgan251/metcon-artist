import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';

type LegendType = 'modality' | 'timeDomain' | 'workoutType';

interface LegendModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LegendModal: React.FC<LegendModalProps> = ({ visible, onClose }) => {
  const [activeLegend, setActiveLegend] = useState<LegendType>('modality');

  const renderModalityLegend = () => (
    <View style={styles.legendContent}>
      <Text style={styles.legendTitle}>Modality Legend</Text>
      <View style={[styles.legendItem, { backgroundColor: '#FF5555' }]}>
        <Text style={styles.legendText}>W - Weightlifting</Text>
      </View>
      <View style={[styles.legendItem, { backgroundColor: '#8BE9FD' }]}>
        <Text style={styles.legendText}>G - Gymnastics</Text>
      </View>
      <View style={[styles.legendItem, { backgroundColor: '#50FA7B' }]}>
        <Text style={styles.legendText}>M - Monostructural</Text>
      </View>
    </View>
  );

  const renderTimeDomainLegend = () => (
    <View style={styles.legendContent}>
      <Text style={styles.legendTitle}>Time Domain Legend</Text>
      <View style={[styles.legendItem, { backgroundColor: '#F1FA8C' }]}>
        <Text style={styles.legendText}>Short - Less than 8 minutes</Text>
      </View>
      <View style={[styles.legendItem, { backgroundColor: '#FFB86C' }]}>
        <Text style={styles.legendText}>Medium - 8 to 20 minutes</Text>
      </View>
      <View style={[styles.legendItem, { backgroundColor: '#FF79C6' }]}>
        <Text style={styles.legendText}>Long - 20+ minutes</Text>
      </View>
    </View>
  );

  const renderWorkoutTypeLegend = () => (
    <View style={styles.legendContent}>
      <Text style={styles.legendTitle}>Workout Type Legend</Text>
      <View style={[styles.legendItem, { backgroundColor: '#BD93F9' }]}>
        <Text style={styles.legendText}>Sets</Text>
      </View>
      <View style={[styles.legendItem, { backgroundColor: '#FF5555' }]}>
        <Text style={styles.legendText}>EMOM</Text>
      </View>
      <View style={[styles.legendItem, { backgroundColor: '#FFB86C' }]}>
        <Text style={styles.legendText}>Benchmark</Text>
      </View>
      <View style={[styles.legendItem, { backgroundColor: '#8BE9FD' }]}>
        <Text style={styles.legendText}>For Time/Reps</Text>
      </View>
      <View style={[styles.legendItem, { backgroundColor: '#50FA7B' }]}>
        <Text style={styles.legendText}>For Time</Text>
      </View>
      <View style={[styles.legendItem, { backgroundColor: '#FF79C6' }]}>
        <Text style={styles.legendText}>AMRAP</Text>
      </View>
      <View style={[styles.legendItem, { backgroundColor: '#F1FA8C' }]}>
        <Text style={styles.legendText}>Intervals</Text>
      </View>
      <View style={[styles.legendItem, { backgroundColor: '#FF79C6' }]}>
        <Text style={styles.legendText}>Skill</Text>
      </View>
    </View>
  );

  const renderLegendContent = () => {
    switch (activeLegend) {
      case 'modality':
        return renderModalityLegend();
      case 'timeDomain':
        return renderTimeDomainLegend();
      case 'workoutType':
        return renderWorkoutTypeLegend();
      default:
        return renderModalityLegend();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity 
          style={styles.modalContent} 
          activeOpacity={1}
          onPress={() => {}} // Prevent closing when touching content
        >
          {/* Header with navigation buttons */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={[
                styles.navButton,
                activeLegend === 'modality' && styles.activeNavButton
              ]}
              onPress={() => setActiveLegend('modality')}
            >
                             <Text style={[
                 styles.navButtonText,
                 activeLegend === 'modality' && styles.activeNavButtonText
               ]}>
                 Modality
               </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.navButton,
                activeLegend === 'timeDomain' && styles.activeNavButton
              ]}
              onPress={() => setActiveLegend('timeDomain')}
            >
                             <Text style={[
                 styles.navButtonText,
                 activeLegend === 'timeDomain' && styles.activeNavButtonText
               ]}>
                 Time Domain
               </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.navButton,
                activeLegend === 'workoutType' && styles.activeNavButton
              ]}
              onPress={() => setActiveLegend('workoutType')}
            >
                             <Text style={[
                 styles.navButtonText,
                 activeLegend === 'workoutType' && styles.activeNavButtonText
               ]}>
                 Workout Type
               </Text>
            </TouchableOpacity>
          </View>

          {/* Legend content */}
          {renderLegendContent()}

          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(40, 42, 54, 0.8)', // Dracula Background with opacity
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#282A36', // Dracula Background
    borderRadius: 16,
    padding: 20,
    margin: 20,
    width: Dimensions.get('window').width - 40,
    maxHeight: Dimensions.get('window').height * 0.7,
    borderWidth: 1,
    borderColor: '#44475A', // Dracula Selection
  },
  modalHeader: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#44475A', // Dracula Selection
    padding: 4,
  },
  navButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeNavButton: {
    backgroundColor: '#BD93F9', // Dracula Purple
  },
  navButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6272A4', // Dracula Comment
  },
  activeNavButtonText: {
    color: '#282A36', // Dracula Background
  },
  legendContent: {
    marginBottom: 20,
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8F8F2', // Dracula Foreground
    marginBottom: 15,
    textAlign: 'center',
  },
  legendItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  legendText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F8F8F2', // Dracula Foreground
  },
  closeButton: {
    backgroundColor: '#6272A4', // Dracula Comment
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8F8F2', // Dracula Foreground
  },
});
