import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  CustomWorkout,
  CreateWorkoutRequest,
  Exercise,
  ExercisePrescription,
  WorkoutType,
  WorkoutSpec,
  SetsSpec,
  EmomSpec,
  ForTimeRepsSpec,
  ForTimeSpec,
  AmrapSpec,
  IntervalsSpec,
  BenchmarkSpec,
  SkillSpec,
} from '../types/workoutCreation';
import { WorkoutValidator } from '../utils/workoutValidator';
import { WorkoutStorage } from '../utils/workoutStorage';

interface WorkoutCreationFormProps {
  initialData: CreateWorkoutRequest;
  existingWorkout?: CustomWorkout;
  onSave: (workout: CustomWorkout) => void;
  onCancel: () => void;
}

export const WorkoutCreationForm: React.FC<WorkoutCreationFormProps> = ({
  initialData,
  existingWorkout,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(existingWorkout?.title || '');
  const [date, setDate] = useState(existingWorkout?.date || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(existingWorkout?.notes || '');
  const [exercises, setExercises] = useState<Exercise[]>(existingWorkout?.exercises || []);
  const [spec, setSpec] = useState<WorkoutSpec | null>(existingWorkout?.spec || null);
  const [errors, setErrors] = useState<string[]>([]);
  const [fieldToggle, setFieldToggle] = useState<'reps_weight' | 'time' | 'calories' | 'distance'>('reps_weight');

  // Pre-populate from initial data
  useEffect(() => {
    if (!existingWorkout) {
      setSpec(createDefaultSpec(initialData.type));
      
      // Pre-populate exercises based on workout type
      const isChipper = initialData.scheme === 'triplet' && initialData.modalities.length === 0;
      let exerciseCount = 1;
      
      if (!isChipper) {
        switch (initialData.scheme) {
          case 'single':
            exerciseCount = 1;
            break;
          case 'couplet':
            exerciseCount = 2;
            break;
          case 'triplet':
            exerciseCount = 3;
            break;
        }
      } else {
        // For chippers, start with 3 exercises as a reasonable default
        exerciseCount = 3;
      }
      
      const initialExercises: Exercise[] = Array(exerciseCount).fill(null).map(() => ({
        name: '',
        prescription: {}
      }));
      
      setExercises(initialExercises);
    }
  }, [initialData, existingWorkout]);

  const createDefaultSpec = (type: WorkoutType): WorkoutSpec => {
    switch (type) {
      case 'sets':
        return { set_scheme: '5x5' } as SetsSpec;
      case 'emom':
        return { cadence_sec: 60, total_minutes: 10 } as EmomSpec;
      case 'for_time_reps':
        return { total_reps: 100, time_cap_min: 10 } as ForTimeRepsSpec;
      case 'for_time':
        return { rounds: 5, time_cap_min: 15 } as ForTimeSpec;
      case 'amrap':
        return { amrap_minutes: 12 } as AmrapSpec;
      case 'intervals':
        return { work_sec: 30, rest_sec: 30, rounds: 10 } as IntervalsSpec;
      case 'benchmark':
        return { reference: 'New', format_hint: 'for_time', time_cap_min: 20 } as BenchmarkSpec;
      case 'skill':
        return { structure: 'Practice', total_minutes: 15 } as SkillSpec;
      default:
        return { rounds: 5, time_cap_min: 15 } as ForTimeSpec;
    }
  };

  const addExercise = () => {
    // Only allow adding exercises for chippers
    const isChipper = initialData.scheme === 'triplet' && initialData.modalities.length === 0;
    
    if (isChipper) {
      const newExercise: Exercise = {
        name: '',
        prescription: {}
      };
      setExercises([...exercises, newExercise]);
    }
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    const updatedExercises = [...exercises];
    if (field === 'prescription') {
      updatedExercises[index] = {
        ...updatedExercises[index],
        prescription: { ...updatedExercises[index].prescription, ...value }
      };
    } else {
      updatedExercises[index] = {
        ...updatedExercises[index],
        [field]: value
      };
    }
    setExercises(updatedExercises);
  };

  const updateSpec = (updates: Partial<WorkoutSpec>) => {
    setSpec(spec ? { ...spec, ...updates } : null);
  };

  const validateAndSave = async () => {
    if (!spec) {
      Alert.alert('Error', 'Please fill in all required workout specifications');
      return;
    }

    const workout: Partial<CustomWorkout> = {
      title: title || 'Untitled Workout', // Make title optional with default
      date,
      scheme: initialData.scheme,
      modalities: initialData.modalities,
      type: initialData.type,
      time_domain: initialData.time_domain,
      exercises,
      spec,
      notes: notes || '', // Make notes optional
      ...(existingWorkout && { id: existingWorkout.id, created_at: existingWorkout.created_at })
    };

    // Custom validation - skip title and notes validation
    const needs: string[] = [];
    
    // Validate exercises
    if (!exercises || exercises.length === 0) {
      needs.push('exercises');
    } else {
      exercises.forEach((exercise, index) => {
        if (!exercise.name || exercise.name.trim() === '') {
          needs.push(`exercise_${index}_name`);
        }
      });
    }

    // Validate spec
    if (workout.type && workout.spec) {
      const specValidation = WorkoutValidator.validateWorkoutSpec(workout.type, workout.spec);
      if (!specValidation.ok) {
        needs.push(...specValidation.needs);
      }
    }
    
    if (needs.length > 0) {
      setErrors(needs);
      Alert.alert('Validation Error', `Please fix the following issues:\n${needs.join('\n')}`);
      return;
    }

    try {
      // Save exercises to storage for future suggestions
      exercises.forEach(exercise => {
        if (exercise.name.trim()) {
          WorkoutStorage.saveExercise(exercise.name.trim());
        }
      });

      let savedWorkout: CustomWorkout;
      if (existingWorkout) {
        // Update existing workout
        const success = await WorkoutStorage.updateWorkout(workout as CustomWorkout);
        if (success) {
          savedWorkout = workout as CustomWorkout;
        } else {
          throw new Error('Failed to update workout');
        }
      } else {
        // Create new workout
        savedWorkout = await WorkoutStorage.saveWorkout(workout as Omit<CustomWorkout, 'id' | 'created_at'>);
      }
      
      onSave(savedWorkout);
    } catch (error) {
      Alert.alert('Error', 'Failed to save workout. Please try again.');
    }
  };

  const renderSpecFields = () => {
    if (!spec) return null;

    switch (initialData.type) {
      case 'sets':
        return (
          <View style={styles.specSection}>
            <Text style={styles.sectionTitle}>Sets Configuration</Text>
            <TextInput
              style={styles.input}
              placeholder="Set scheme (e.g., 5x5, 8x2)"
              value={(spec as SetsSpec).set_scheme}
              onChangeText={(text) => updateSpec({ set_scheme: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Intensity hint (optional, e.g., ~80%)"
              value={(spec as SetsSpec).intensity_hint || ''}
              onChangeText={(text) => updateSpec({ intensity_hint: text })}
            />
          </View>
        );

      case 'emom':
        return (
          <View style={styles.specSection}>
            <Text style={styles.sectionTitle}>EMOM Configuration</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Cadence:</Text>
              <View style={styles.buttonGroup}>
                {[60, 120, 180].map(sec => (
                  <TouchableOpacity
                    key={sec}
                    style={[
                      styles.smallButton,
                      (spec as EmomSpec).cadence_sec === sec && styles.selectedButton
                    ]}
                                         onPress={() => updateSpec({ cadence_sec: sec as 60 | 120 | 180 })}
                  >
                    <Text style={styles.smallButtonText}>{sec}s</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Total minutes"
              value={(spec as EmomSpec).total_minutes?.toString() || ''}
              onChangeText={(text) => updateSpec({ total_minutes: parseInt(text) || 0 })}
              keyboardType="numeric"
            />
          </View>
        );

      case 'for_time_reps':
        return (
          <View style={styles.specSection}>
            <Text style={styles.sectionTitle}>For Time/Reps Configuration</Text>
            <TextInput
              style={styles.input}
              placeholder="Total reps"
              value={(spec as ForTimeRepsSpec).total_reps?.toString() || ''}
              onChangeText={(text) => updateSpec({ total_reps: parseInt(text) || 0 })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Time cap (minutes)"
              value={(spec as ForTimeRepsSpec).time_cap_min?.toString() || ''}
              onChangeText={(text) => updateSpec({ time_cap_min: parseInt(text) || 0 })}
              keyboardType="numeric"
            />
          </View>
        );

      case 'for_time':
        return (
          <View style={styles.specSection}>
            <Text style={styles.sectionTitle}>For Time Configuration</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Number of Rounds</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 5 rounds"
                value={(spec as ForTimeSpec).rounds?.toString() || ''}
                onChangeText={(text) => updateSpec({ rounds: parseInt(text) || 0 })}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Time Cap (minutes)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 15 minutes"
                value={(spec as ForTimeSpec).time_cap_min?.toString() || ''}
                onChangeText={(text) => updateSpec({ time_cap_min: parseInt(text) || 0 })}
                keyboardType="numeric"
              />
            </View>
          </View>
        );

      case 'amrap':
        return (
          <View style={styles.specSection}>
            <Text style={styles.sectionTitle}>AMRAP Configuration</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Time Limit (minutes)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 12 minutes"
                value={(spec as AmrapSpec).amrap_minutes?.toString() || ''}
                onChangeText={(text) => updateSpec({ amrap_minutes: parseInt(text) || 0 })}
                keyboardType="numeric"
              />
            </View>
          </View>
        );

      case 'intervals':
        return (
          <View style={styles.specSection}>
            <Text style={styles.sectionTitle}>Intervals Configuration</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Work Interval (seconds)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 30 seconds"
                value={(spec as IntervalsSpec).work_sec?.toString() || ''}
                onChangeText={(text) => updateSpec({ work_sec: parseInt(text) || 0 })}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Rest Interval (seconds)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 30 seconds"
                value={(spec as IntervalsSpec).rest_sec?.toString() || ''}
                onChangeText={(text) => updateSpec({ rest_sec: parseInt(text) || 0 })}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Number of Rounds</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 10 rounds"
                value={(spec as IntervalsSpec).rounds?.toString() || ''}
                onChangeText={(text) => updateSpec({ rounds: parseInt(text) || 0 })}
                keyboardType="numeric"
              />
            </View>
          </View>
        );

      case 'benchmark':
        return (
          <View style={styles.specSection}>
            <Text style={styles.sectionTitle}>Benchmark Configuration</Text>
            <TextInput
              style={styles.input}
              placeholder="Reference (e.g., 'Fran', 'New')"
              value={(spec as BenchmarkSpec).reference}
              onChangeText={(text) => updateSpec({ reference: text })}
            />
            <View style={styles.row}>
              <Text style={styles.label}>Format:</Text>
              <View style={styles.buttonGroup}>
                {['for_time', 'amrap', 'sets', 'time_trial'].map(format => (
                  <TouchableOpacity
                    key={format}
                    style={[
                      styles.smallButton,
                      (spec as BenchmarkSpec).format_hint === format && styles.selectedButton
                    ]}
                    onPress={() => updateSpec({ format_hint: format as any })}
                  >
                    <Text style={styles.smallButtonText}>{format}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Time cap (minutes)"
              value={(spec as BenchmarkSpec).time_cap_min?.toString() || ''}
              onChangeText={(text) => updateSpec({ time_cap_min: parseInt(text) || 0 })}
              keyboardType="numeric"
            />
          </View>
        );

      case 'skill':
        return (
          <View style={styles.specSection}>
            <Text style={styles.sectionTitle}>Skill Configuration</Text>
            <TextInput
              style={styles.input}
              placeholder="Structure description"
              value={(spec as SkillSpec).structure}
              onChangeText={(text) => updateSpec({ structure: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Total minutes"
              value={(spec as SkillSpec).total_minutes?.toString() || ''}
              onChangeText={(text) => updateSpec({ total_minutes: parseInt(text) || 0 })}
              keyboardType="numeric"
            />
          </View>
        );

      default:
        return null;
    }
  };

  const renderModalityTags = () => (
    <View style={styles.modalitySection}>
      <Text style={styles.sectionTitle}>Required Modalities</Text>
      <View style={styles.modalityTags}>
        {initialData.modalities.map((modality, index) => (
          <View key={index} style={[styles.modalityTag, { backgroundColor: getModalityColor(modality) }]}>
            <Text style={styles.modalityTagText}>
              {modality} - {getModalityDescription(modality)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const getModalityColor = (modality: string): string => {
    switch (modality) {
      case 'W': return '#FF6B6B';
      case 'G': return '#4ECDC4';
      case 'M': return '#45B7D1';
      default: return '#95A5A6';
    }
  };

  const getModalityDescription = (modality: string): string => {
    switch (modality) {
      case 'W': return 'Weightlifting';
      case 'G': return 'Gymnastics';
      case 'M': return 'Monostructural';
      default: return '';
    }
  };

  const getTimeDomainDescription = (timeDomain: string): string => {
    switch (timeDomain) {
      case 'short': return '< 8 min';
      case 'medium': return '8-20 min';
      case 'long': return '20+ min';
      default: return timeDomain;
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Custom Workout</Text>
          <Text style={styles.subtitle}>
            {initialData.scheme.charAt(0).toUpperCase() + initialData.scheme.slice(1)} • {initialData.type.replace('_', ' ').toUpperCase()} • {getTimeDomainDescription(initialData.time_domain)}
          </Text>
        </View>

        {renderModalityTags()}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Workout title (optional)"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
          />
        </View>

        {renderSpecFields()}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          
          {/* Field Toggle Buttons */}
          <View style={styles.fieldToggleContainer}>
            <Text style={styles.fieldToggleLabel}>Prescription Type:</Text>
            <View style={styles.fieldToggleButtons}>
              <TouchableOpacity
                style={[
                  styles.fieldToggleButton,
                  fieldToggle === 'reps_weight' && styles.fieldToggleButtonActive
                ]}
                onPress={() => setFieldToggle('reps_weight')}
              >
                <Text style={[
                  styles.fieldToggleButtonText,
                  fieldToggle === 'reps_weight' && styles.fieldToggleButtonTextActive
                ]}>Reps & Weight</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.fieldToggleButton,
                  fieldToggle === 'time' && styles.fieldToggleButtonActive
                ]}
                onPress={() => setFieldToggle('time')}
              >
                <Text style={[
                  styles.fieldToggleButtonText,
                  fieldToggle === 'time' && styles.fieldToggleButtonTextActive
                ]}>Time</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.fieldToggleButton,
                  fieldToggle === 'calories' && styles.fieldToggleButtonActive
                ]}
                onPress={() => setFieldToggle('calories')}
              >
                <Text style={[
                  styles.fieldToggleButtonText,
                  fieldToggle === 'calories' && styles.fieldToggleButtonTextActive
                ]}>Calories</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.fieldToggleButton,
                  fieldToggle === 'distance' && styles.fieldToggleButtonActive
                ]}
                onPress={() => setFieldToggle('distance')}
              >
                <Text style={[
                  styles.fieldToggleButtonText,
                  fieldToggle === 'distance' && styles.fieldToggleButtonTextActive
                ]}>Distance</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {(() => {
            const isChipper = initialData.scheme === 'triplet' && initialData.modalities.length === 0;
            const maxExercises = isChipper ? 'unlimited' : 
                                initialData.scheme === 'single' ? 1 : 
                                initialData.scheme === 'couplet' ? 2 : 3;
            const canAddMore = isChipper || exercises.length < (maxExercises as number);
            
            return (
              <>
                <Text style={styles.exerciseLimitText}>
                  {isChipper ? 'Chipper - 3 exercises pre-configured, add more as needed' : 
                   `${initialData.scheme.charAt(0).toUpperCase() + initialData.scheme.slice(1)} - ${maxExercises} exercise${maxExercises !== 1 ? 's' : ''} pre-configured`}
                </Text>
                {exercises.map((exercise, index) => (
                  <View key={index} style={styles.exerciseCard}>
                    <View style={styles.exerciseHeader}>
                      <Text style={styles.exerciseNumber}>Exercise {index + 1}</Text>
                      {(isChipper && exercises.length > 1) || (!isChipper && exercises.length > (initialData.scheme === 'single' ? 1 : initialData.scheme === 'couplet' ? 2 : 3)) && (
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removeExercise(index)}
                        >
                          <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Exercise name"
                      value={exercise.name}
                      onChangeText={(text) => updateExercise(index, 'name', text)}
                    />
                    
                    {/* Conditional field rendering based on toggle */}
                    {fieldToggle === 'reps_weight' && (
                      <>
                        <TextInput
                          style={styles.input}
                          placeholder="Reps (e.g., 10, 5-5-5)"
                          value={exercise.prescription.reps || ''}
                          onChangeText={(text) => updateExercise(index, 'prescription', { reps: text })}
                        />
                        <TextInput
                          style={styles.input}
                          placeholder="Weight (e.g., 95/65 lb)"
                          value={exercise.prescription.weight || ''}
                          onChangeText={(text) => updateExercise(index, 'prescription', { weight: text })}
                        />
                      </>
                    )}
                    
                    {fieldToggle === 'time' && (
                      <TextInput
                        style={styles.input}
                        placeholder="Time (seconds)"
                        value={exercise.prescription.time_sec?.toString() || ''}
                        onChangeText={(text) => updateExercise(index, 'prescription', { time_sec: parseInt(text) || undefined })}
                        keyboardType="numeric"
                      />
                    )}
                    
                    {fieldToggle === 'calories' && (
                      <TextInput
                        style={styles.input}
                        placeholder="Calories"
                        value={exercise.prescription.cals?.toString() || ''}
                        onChangeText={(text) => updateExercise(index, 'prescription', { cals: parseInt(text) || undefined })}
                        keyboardType="numeric"
                      />
                    )}
                    
                    {fieldToggle === 'distance' && (
                      <TextInput
                        style={styles.input}
                        placeholder="Distance (meters)"
                        value={exercise.prescription.distance_m?.toString() || ''}
                        onChangeText={(text) => updateExercise(index, 'prescription', { distance_m: parseInt(text) || undefined })}
                        keyboardType="numeric"
                      />
                    )}
                  </View>
                ))}
                {isChipper && (
                  <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={addExercise}
                  >
                    <Text style={styles.addButtonText}>
                      + Add Exercise
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            );
          })()}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Additional notes (optional)"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={validateAndSave}>
            <Text style={styles.saveButtonText}>Create Workout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  subtitle: {
    fontSize: 16,
    color: '#6272A4', // Dracula Comment
  },
  modalitySection: {
    marginBottom: 20,
  },
  modalityTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalityTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modalityTagText: {
    color: '#F8F8F2', // Dracula Foreground
    fontWeight: 'bold',
    fontSize: 12,
  },
  section: {
    marginBottom: 20,
  },
  specSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8F8F2', // Dracula Foreground
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#44475A', // Dracula Selection
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#6272A4', // Dracula Comment
    color: '#F8F8F2', // Dracula Foreground
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8F8F2', // Dracula Foreground
    marginRight: 12,
    minWidth: 80,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#44475A', // Dracula Selection
    borderWidth: 1,
    borderColor: '#6272A4', // Dracula Comment
  },
  selectedButton: {
    backgroundColor: '#BD93F9', // Dracula Purple
    borderColor: '#BD93F9',
  },
  smallButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8F8F2', // Dracula Foreground
  },
  exerciseCard: {
    backgroundColor: '#44475A', // Dracula Selection
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#6272A4', // Dracula Comment
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8F8F2', // Dracula Foreground
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF5555', // Dracula Red
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#F8F8F2', // Dracula Foreground
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#50FA7B', // Dracula Green
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#282A36', // Dracula Background
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseLimitText: {
    fontSize: 14,
    color: '#6272A4', // Dracula Comment
    marginBottom: 12,
    fontStyle: 'italic',
  },
  disabledButton: {
    backgroundColor: '#6272A4', // Dracula Comment
  },
  disabledButtonText: {
    color: '#44475A', // Dracula Selection
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6272A4', // Dracula Comment
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#F8F8F2', // Dracula Foreground
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#BD93F9', // Dracula Purple
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#282A36', // Dracula Background
    fontSize: 16,
    fontWeight: 'bold',
  },
  fieldToggleContainer: {
    marginBottom: 16,
  },
  fieldToggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8F8F2', // Dracula Foreground
    marginBottom: 8,
  },
  fieldToggleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fieldToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#44475A', // Dracula Selection
    borderWidth: 1,
    borderColor: '#6272A4', // Dracula Comment
  },
  fieldToggleButtonActive: {
    backgroundColor: '#BD93F9', // Dracula Purple
    borderColor: '#BD93F9',
  },
  fieldToggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8F8F2', // Dracula Foreground
  },
  fieldToggleButtonTextActive: {
    color: '#282A36', // Dracula Background
  },
});
