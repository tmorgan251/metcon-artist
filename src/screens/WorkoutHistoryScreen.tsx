import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
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

type WorkoutHistoryScreenProps = StackScreenProps<RootStackParamList, 'WorkoutHistory'>;

export const WorkoutHistoryScreen: React.FC<WorkoutHistoryScreenProps> = ({ navigation }) => {
  const [workouts, setWorkouts] = useState<CustomWorkout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const savedWorkouts = await WorkoutStorage.getWorkouts();
      setWorkouts(savedWorkouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutPress = (workout: CustomWorkout) => {
    navigation.navigate('WorkoutDetail', { workout });
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await WorkoutStorage.deleteWorkout(workoutId);
              await loadWorkouts(); // Reload the list
            } catch (error) {
              Alert.alert('Error', 'Failed to delete workout');
            }
          },
        },
      ]
    );
  };

  const renderWorkoutItem = ({ item }: { item: CustomWorkout }) => (
    <TouchableOpacity
      style={styles.workoutCard}
      onPress={() => handleWorkoutPress(item)}
    >
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutTitle}>
          {item.title || 'Untitled Workout'}
        </Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteWorkout(item.id)}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.workoutDate}>{item.date}</Text>
      
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutInfoText}>
          {item.scheme.charAt(0).toUpperCase() + item.scheme.slice(1)} • {item.type.replace('_', ' ').toUpperCase()}
        </Text>
        <Text style={styles.workoutInfoText}>
          {item.exercises.length} exercise{item.exercises.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {item.exercises.slice(0, 2).map((exercise, index) => (
        <Text key={index} style={styles.exerciseText}>
          • {exercise.name}
        </Text>
      ))}
      
      {item.exercises.length > 2 && (
        <Text style={styles.moreExercisesText}>
          +{item.exercises.length - 2} more exercise{item.exercises.length - 2 !== 1 ? 's' : ''}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading workouts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workout History</Text>
        <Text style={styles.headerSubtitle}>
          {workouts.length} workout{workouts.length !== 1 ? 's' : ''} created
        </Text>
      </View>

      {workouts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Workouts Yet</Text>
          <Text style={styles.emptyText}>
            Create your first workout to see it here!
          </Text>
        </View>
      ) : (
        <FlatList
          data={workouts}
          renderItem={renderWorkoutItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282A36', // Dracula Background
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#44475A', // Dracula Selection
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8F8F2', // Dracula Foreground
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6272A4', // Dracula Comment
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#F8F8F2', // Dracula Foreground
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8F8F2', // Dracula Foreground
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#6272A4', // Dracula Comment
    textAlign: 'center',
    lineHeight: 24,
  },
  listContainer: {
    padding: 20,
  },
  workoutCard: {
    backgroundColor: '#44475A', // Dracula Selection
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#6272A4', // Dracula Comment
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8F8F2', // Dracula Foreground
    flex: 1,
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF5555', // Dracula Red
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#F8F8F2', // Dracula Foreground
    fontSize: 16,
    fontWeight: 'bold',
  },
  workoutDate: {
    fontSize: 14,
    color: '#6272A4', // Dracula Comment
    marginBottom: 8,
  },
  workoutInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  workoutInfoText: {
    fontSize: 14,
    color: '#8BE9FD', // Dracula Cyan
    fontWeight: '600',
  },
  exerciseText: {
    fontSize: 14,
    color: '#F8F8F2', // Dracula Foreground
    marginBottom: 2,
  },
  moreExercisesText: {
    fontSize: 12,
    color: '#6272A4', // Dracula Comment
    fontStyle: 'italic',
    marginTop: 4,
  },
});
