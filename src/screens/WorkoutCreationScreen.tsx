import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { WorkoutCreationForm } from '../components/WorkoutCreationForm';
import { CreateWorkoutRequest, CustomWorkout } from '../types/workoutCreation';

type RootStackParamList = {
  Home: undefined;
  WorkoutCreation: { initialData: CreateWorkoutRequest; existingWorkout?: any };
};

type WorkoutCreationScreenProps = StackScreenProps<RootStackParamList, 'WorkoutCreation'>;

export const WorkoutCreationScreen: React.FC<WorkoutCreationScreenProps> = ({
  route,
  navigation,
}) => {
  const { initialData, existingWorkout } = route.params;

  const handleSave = (workout: CustomWorkout) => {
    // Navigate back to main screen
    navigation.goBack();
    // Could show a success message or navigate to calendar view
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <WorkoutCreationForm
        initialData={initialData}
        existingWorkout={existingWorkout}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282A36', // Dracula Background
  },
});
