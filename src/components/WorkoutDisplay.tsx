import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Workout, Modality, TimeDomain, WorkoutType } from '../types/workout';

interface WorkoutDisplayProps {
  workout: Workout;
  getModalityDescription: (modality: Modality) => string;
  getModalityColor: (modality: Modality, theme: any) => string;
  getTimeDomainDescription: (timeDomain: TimeDomain) => string;
  getTimeDomainColor: (timeDomain: TimeDomain, theme: any) => string;
  getWorkoutTypeDescription: (workoutType: WorkoutType) => string;
  getWorkoutTypeColor: (workoutType: WorkoutType, theme: any) => string;
  theme: {
    background: string;
    selection: string;
    foreground: string;
    comment: string;
    red: string;
    orange: string;
    yellow: string;
    green: string;
    cyan: string;
    purple: string;
    pink: string;
  };
}

export const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({
  workout,
  getModalityDescription,
  getModalityColor,
  getTimeDomainDescription,
  getTimeDomainColor,
  getWorkoutTypeDescription,
  getWorkoutTypeColor,
  theme,
}) => {
  const isChipper = workout.structure === 'chipper';

  // Theme-aware color functions
  const getThemeModalityColor = (modality: Modality): string => {
    switch (modality) {
      case 'W': return theme.red;
      case 'G': return theme.cyan;
      case 'M': return theme.green;
      default: return theme.comment;
    }
  };

  const getThemeTimeDomainColor = (timeDomain: TimeDomain): string => {
    switch (timeDomain) {
      case 'short': return theme.yellow;
      case 'medium': return theme.orange;
      case 'long': return theme.pink;
      default: return theme.comment;
    }
  };

  const getThemeWorkoutTypeColor = (workoutType: WorkoutType): string => {
    switch (workoutType) {
      case 'sets': return theme.purple;
      case 'emom': return theme.red;
      case 'benchmark': return theme.orange;
      case 'for_time_reps': return theme.cyan;
      case 'for_time': return theme.green;
      case 'amrap': return theme.pink;
      case 'intervals': return theme.yellow;
      case 'skill': return theme.comment;
      default: return theme.comment;
    }
  };

  return (
    <View style={[styles.workoutCard, { backgroundColor: theme.selection }]}>
      <Text style={[styles.workoutName, { color: theme.foreground }]}>{workout.name}</Text>
      
      {/* Time Domain and Workout Type Badges */}
      <View style={styles.badgesContainer}>
        <View
          style={[
            styles.timeDomainBadge,
            { backgroundColor: getThemeTimeDomainColor(workout.timeDomain) }
          ]}
        >
          <Text style={[styles.timeDomainText, { color: theme.foreground }]}>
            {getTimeDomainDescription(workout.timeDomain)}
          </Text>
        </View>
        
        <View
          style={[
            styles.workoutTypeBadge,
            { backgroundColor: getThemeWorkoutTypeColor(workout.workoutType) }
          ]}
        >
          <Text style={[styles.workoutTypeText, { color: theme.foreground }]}>
            {getWorkoutTypeDescription(workout.workoutType)}
          </Text>
        </View>
      </View>

      {!isChipper && workout.modalities.length > 0 && (
        <View style={styles.modalitiesContainer}>
          {workout.modalities.map((modality, index) => (
            <View
              key={index}
              style={[
                styles.modalityBadge,
                { backgroundColor: getThemeModalityColor(modality) }
              ]}
            >
              <Text style={[styles.modalityText, { color: theme.foreground }]}>{modality}</Text>
              <Text style={[styles.modalityDescription, { color: theme.foreground }]}>
                {getModalityDescription(modality)}
              </Text>
            </View>
          ))}
        </View>
      )}
      
      {isChipper && (
        <View style={styles.chipperContainer}>
          <Text style={[styles.chipperDescription, { color: theme.foreground }]}>
            A chipper workout consists of multiple movements performed in sequence, 
            typically with high volume and varied modalities.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  workoutCard: {
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  workoutName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 15,
  },
  timeDomainBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  timeDomainText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  workoutTypeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  workoutTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  modalityBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  modalityText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalityDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  chipperContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  chipperDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
