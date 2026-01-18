import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  ExerciseList: { theme: any; lastWorkout: any };
};

type ExerciseListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ExerciseList'>;
type ExerciseListScreenRouteProp = RouteProp<RootStackParamList, 'ExerciseList'>;

interface ExerciseListScreenProps {
  navigation: ExerciseListScreenNavigationProp;
  route: ExerciseListScreenRouteProp;
}

const exercises = {
  weightlifting: {
    name: 'Weightlifting',
    description: 'Barbell, Dumbbell, Kettlebell, Med Ball',
    categories: {
      'Olympic lifts & derivatives': [
        'Snatch', 'Power Snatch', 'Hang Snatch', 'Squat Snatch',
        'Clean and Jerk', 'Squat Clean', 'Power Clean', 'Hang Clean',
        'Clean Pull', 'Snatch Pull'
      ],
      'Squats': [
        'Back Squat', 'Front Squat', 'Overhead Squat', 'Goblet Squat', 'Zercher Squat'
      ],
      'Presses & Jerks': [
        'Shoulder Press / Strict Press', 'Push Press', 'Push Jerk', 'Split Jerk'
      ],
      'Deadlifts & pulls': [
        'Deadlift', 'Sumo Deadlift', 'Romanian Deadlift', 'Sumo Deadlift High Pull'
      ],
      'Combination lifts': [
        'Thruster (barbell, dumbbell)', 'Wall Ball Shot', 'Dumbbell Thruster'
      ],
      'Kettlebell': [
        'Kettlebell Swing (Russian)', 'Kettlebell Swing (American)', 'Kettlebell Snatch',
        'Kettlebell Clean and Jerk', 'Kettlebell Goblet Squat'
      ],
      'Carries & odd lifts': [
        'Farmer\'s Carry (dumbbells, kettlebells)', 'Overhead Carry', 'Waiter Carry',
        'Turkish Get-Up'
      ],
      'Other loaded lifts': [
        'Bench Press', 'Floor Press', 'Push-Up with Load (weighted vest, plate)'
      ],
      'Strongman / Odd Object': [
        'Sandbag Clean', 'Sandbag Over Shoulder', 'Sandbag Carry', 'Sandbag to Shoulder for Reps',
        'Atlas Stone Lift', 'Atlas Stone Carry', 'Yoke Carry', 'Sled Push', 'Sled Pull (forward/backward)',
        'Tire Flip', 'D-Ball Clean', 'D-Ball Carry', 'Log Clean and Press'
      ]
    }
  },
  gymnastics: {
    name: 'Gymnastics',
    description: 'Bodyweight & Skill',
    categories: {
      'Pulling': [
        'Pull-Up (Strict)', 'Kipping Pull-Up', 'Butterfly Pull-Up', 'Chest-to-Bar Pull-Up',
        'Bar Muscle-Up', 'Ring Muscle-Up', 'Rope Climb (with legs)', 'Rope Climb (legless)'
      ],
      'Pressing / pushing': [
        'Push-Up', 'Handstand Push-Up (Strict)', 'Handstand Push-Up (Kipping)',
        'Handstand Walk', 'Wall Walk', 'Dips (Ring)', 'Dips (Bar/Bench)'
      ],
      'Core & midline': [
        'Toes-to-Bar', 'Knees-to-Elbows', 'Hanging Knee Raise', 'GHD Sit-Up',
        'Sit-Up (AbMat, anchored)', 'V-Up', 'Hollow Hold', 'Hollow Rock',
        'Superman Hold', 'L-Sit (rings, bar, parallettes)'
      ],
      'Lower body / balance': [
        'Air Squat', 'Pistol Squat (single leg)', 'Walking Lunge (bodyweight)',
        'Jumping Lunge'
      ],
      'Burpee variations': [
        'Burpee (standard)', 'Burpee to Target', 'Burpee Over Bar',
        'Burpee Box Jump', 'Burpee Box Jump Over'
      ],
      'Other skills': [
        'Inverted Hang (rings/bar)', 'Skin-the-Cat', 'Tuck Hold (rings/bar)'
      ]
    }
  },
  monostructural: {
    name: 'Monostructural',
    description: 'Cardio/Endurance',
    categories: {
      'Running': [
        'Running (short sprints)', 'Running (middle distance)', 'Running (long distance)'
      ],
      'Rowing': [
        'Rowing (erg)'
      ],
      'Other cardio': [
        'SkiErg', 'Assault Bike / Echo Bike (air bike)', 'Jump Rope – Single-Unders',
        'Jump Rope – Double-Unders', 'Jump Rope – Triple-Unders', 'Swimming (any stroke)',
        'Hiking / Rucking', 'Stair Running / Hill Sprints'
      ]
    }
  }
};

export const ExerciseListScreen: React.FC<ExerciseListScreenProps> = ({ navigation, route }) => {
  const { theme, lastWorkout } = route.params;

  const getModalityColor = (modality: string) => {
    switch (modality.toLowerCase()) {
      case 'w': return theme.orange;
      case 'g': return theme.green;
      case 'm': return theme.cyan;
      default: return theme.comment;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style="light" backgroundColor={theme.background} />
      
      {/* Custom Header with Back Button */}
      <View style={[styles.header, { backgroundColor: theme.selection }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.background, borderColor: theme.comment }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backButtonText, { color: theme.foreground }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.foreground }]}>Exercise List</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
        alwaysBounceVertical={true}
        nestedScrollEnabled={false}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={true}
        directionalLockEnabled={false}
        overScrollMode="auto"
      >
        {/* Last Generated Workout Section */}
        {lastWorkout && (
          <View style={[styles.lastWorkoutSection, { backgroundColor: theme.selection, borderColor: theme.comment }]}>
            <Text style={[styles.lastWorkoutTitle, { color: theme.foreground }]}>Last Generated Workout</Text>
            <View style={styles.workoutTags}>
              <View style={[styles.tag, { backgroundColor: getModalityColor(lastWorkout.modalities[0]) }]}>
                <Text style={[styles.tagText, { color: theme.background }]}>
                  {lastWorkout.modalities[0] === 'W' ? 'Weightlifting' : 
                   lastWorkout.modalities[0] === 'G' ? 'Gymnastics' : 'Monostructural'}
                </Text>
              </View>
              {lastWorkout.modalities.length > 1 && (
                <View style={[styles.tag, { backgroundColor: getModalityColor(lastWorkout.modalities[1]) }]}>
                  <Text style={[styles.tagText, { color: theme.background }]}>
                    {lastWorkout.modalities[1] === 'W' ? 'Weightlifting' : 
                     lastWorkout.modalities[1] === 'G' ? 'Gymnastics' : 'Monostructural'}
                  </Text>
                </View>
              )}
              {lastWorkout.modalities.length > 2 && (
                <View style={[styles.tag, { backgroundColor: getModalityColor(lastWorkout.modalities[2]) }]}>
                  <Text style={[styles.tagText, { color: theme.background }]}>
                    {lastWorkout.modalities[2] === 'W' ? 'Weightlifting' : 
                     lastWorkout.modalities[2] === 'G' ? 'Gymnastics' : 'Monostructural'}
                  </Text>
                </View>
              )}
            </View>
            <Text style={[styles.workoutInfo, { color: theme.comment }]}>
              {lastWorkout.structure.charAt(0).toUpperCase() + lastWorkout.structure.slice(1)} • {lastWorkout.timeDomain} • {lastWorkout.workoutType.replace('_', ' ')}
            </Text>
          </View>
        )}

        {/* Exercise Categories */}
        {Object.entries(exercises).map(([key, modality]) => (
          <View key={key} style={styles.modalitySection}>
            <View style={[styles.modalityHeader, { backgroundColor: getModalityColor(key === 'weightlifting' ? 'W' : key === 'gymnastics' ? 'G' : 'M') }]}>
              <Text style={[styles.modalityName, { color: theme.background }]}>{modality.name}</Text>
              <Text style={[styles.modalityDescription, { color: theme.background }]}>{modality.description}</Text>
            </View>
            
            {Object.entries(modality.categories).map(([categoryName, exerciseList]) => (
              <View key={categoryName} style={[styles.categoryCard, { backgroundColor: theme.selection, borderColor: theme.comment }]}>
                <Text style={[styles.categoryTitle, { color: theme.foreground }]}>{categoryName}</Text>
                {exerciseList.map((exercise, index) => (
                  <Text key={index} style={[styles.exerciseItem, { color: theme.foreground }]}>
                    • {exercise}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'web' ? 10 : 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 90,
  },
  scrollView: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      height: '100%',
    } as any),
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    ...(Platform.OS === 'web' && {
      minHeight: '100%',
    }),
  },
  lastWorkoutSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
  },
  lastWorkoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  workoutTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
  },
  workoutInfo: {
    fontSize: 14,
  },
  modalitySection: {
    marginBottom: 24,
  },
  modalityHeader: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  modalityName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modalityDescription: {
    fontSize: 14,
    opacity: 0.9,
  },
  categoryCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  exerciseItem: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
});



