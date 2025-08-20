import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { CustomWorkout } from '../types/workoutCreation';
import { WorkoutStorage } from '../utils/workoutStorage';

type RootStackParamList = {
  Home: undefined;
  WorkoutCreation: { initialData: any };
  WorkoutHistory: undefined;
  WorkoutDetail: { workout: CustomWorkout };
};

type WorkoutDetailScreenProps = StackScreenProps<RootStackParamList, 'WorkoutDetail'>;

export const WorkoutDetailScreen: React.FC<WorkoutDetailScreenProps> = ({ 
  route, 
  navigation 
}) => {
  const { workout } = route.params;
  const [results, setResults] = useState({
    time: '',
    score: '',
    notes: workout.notes || '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveResults = async () => {
    try {
      const updatedWorkout = {
        ...workout,
        results: {
          time: results.time,
          score: results.score,
          completedAt: new Date().toISOString(),
        },
        notes: results.notes,
      };
      
      await WorkoutStorage.updateWorkout(updatedWorkout);
      Alert.alert('Success', 'Workout results saved!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save results');
    }
  };

  const handleEditWorkout = () => {
    // Navigate to workout creation with existing data
    const initialData = {
      scheme: workout.scheme,
      modalities: workout.modalities,
      type: workout.type,
      time_domain: workout.time_domain,
    };
    
    navigation.navigate('WorkoutCreation', { 
      initialData,
      existingWorkout: workout 
    });
  };

  const renderWorkoutSpec = () => {
    switch (workout.type) {
      case 'sets':
        return (
          <View style={styles.specSection}>
            <Text style={styles.specTitle}>Sets Configuration</Text>
            <Text style={styles.specText}>Scheme: {workout.spec.set_scheme}</Text>
            {workout.spec.intensity_hint && (
              <Text style={styles.specText}>Intensity: {workout.spec.intensity_hint}</Text>
            )}
          </View>
        );
      
      case 'emom':
        return (
          <View style={styles.specSection}>
            <Text style={styles.specTitle}>EMOM Configuration</Text>
            <Text style={styles.specText}>Cadence: {workout.spec.cadence_sec}s</Text>
            <Text style={styles.specText}>Duration: {workout.spec.total_minutes} minutes</Text>
          </View>
        );
      
      case 'for_time':
        return (
          <View style={styles.specSection}>
            <Text style={styles.specTitle}>For Time Configuration</Text>
            <Text style={styles.specText}>Rounds: {workout.spec.rounds}</Text>
            <Text style={styles.specText}>Time Cap: {workout.spec.time_cap_min} minutes</Text>
          </View>
        );
      
      case 'amrap':
        return (
          <View style={styles.specSection}>
            <Text style={styles.specTitle}>AMRAP Configuration</Text>
            <Text style={styles.specText}>Time Limit: {workout.spec.amrap_minutes} minutes</Text>
          </View>
        );
      
      case 'intervals':
        return (
          <View style={styles.specSection}>
            <Text style={styles.specTitle}>Intervals Configuration</Text>
            <Text style={styles.specText}>Work: {workout.spec.work_sec}s</Text>
            <Text style={styles.specText}>Rest: {workout.spec.rest_sec}s</Text>
            <Text style={styles.specText}>Rounds: {workout.spec.rounds}</Text>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{workout.title || 'Untitled Workout'}</Text>
          <Text style={styles.date}>{workout.date}</Text>
          <Text style={styles.subtitle}>
            {workout.scheme.charAt(0).toUpperCase() + workout.scheme.slice(1)} • {workout.type.replace('_', ' ').toUpperCase()}
          </Text>
        </View>

        {renderWorkoutSpec()}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          {workout.exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              {exercise.prescription.reps && (
                <Text style={styles.exerciseDetail}>Reps: {exercise.prescription.reps}</Text>
              )}
              {exercise.prescription.weight && (
                <Text style={styles.exerciseDetail}>Weight: {exercise.prescription.weight}</Text>
              )}
              {exercise.prescription.distance_m && (
                <Text style={styles.exerciseDetail}>Distance: {exercise.prescription.distance_m}m</Text>
              )}
              {exercise.prescription.time_sec && (
                <Text style={styles.exerciseDetail}>Time: {exercise.prescription.time_sec}s</Text>
              )}
              {exercise.prescription.cals && (
                <Text style={styles.exerciseDetail}>Calories: {exercise.prescription.cals}</Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Results</Text>
          <View style={styles.resultsContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Time (mm:ss)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 12:34"
                value={results.time}
                onChangeText={(text) => setResults({ ...results, time: text })}
                placeholderTextColor="#6272A4"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Score</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 150 reps, 5 rounds"
                value={results.score}
                onChangeText={(text) => setResults({ ...results, score: text })}
                placeholderTextColor="#6272A4"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add notes about your performance..."
            value={results.notes}
            onChangeText={(text) => setResults({ ...results, notes: text })}
            multiline
            numberOfLines={4}
            placeholderTextColor="#6272A4"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditWorkout}>
            <Text style={styles.editButtonText}>Edit Workout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveResults}>
            <Text style={styles.saveButtonText}>Save Results</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282A36', // Dracula Background
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8F8F2', // Dracula Foreground
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#6272A4', // Dracula Comment
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8BE9FD', // Dracula Cyan
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8F8F2', // Dracula Foreground
    marginBottom: 12,
  },
  specSection: {
    backgroundColor: '#44475A', // Dracula Selection
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#6272A4', // Dracula Comment
  },
  specTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8F8F2', // Dracula Foreground
    marginBottom: 8,
  },
  specText: {
    fontSize: 14,
    color: '#F8F8F2', // Dracula Foreground
    marginBottom: 4,
  },
  exerciseCard: {
    backgroundColor: '#44475A', // Dracula Selection
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#6272A4', // Dracula Comment
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8F8F2', // Dracula Foreground
    marginBottom: 8,
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#8BE9FD', // Dracula Cyan
    marginBottom: 2,
  },
  resultsContainer: {
    backgroundColor: '#44475A', // Dracula Selection
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6272A4', // Dracula Comment
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8F8F2', // Dracula Foreground
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#282A36', // Dracula Background
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#6272A4', // Dracula Comment
    color: '#F8F8F2', // Dracula Foreground
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#6272A4', // Dracula Comment
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#F8F8F2', // Dracula Foreground
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#50FA7B', // Dracula Green
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#282A36', // Dracula Background
    fontSize: 16,
    fontWeight: 'bold',
  },
});
