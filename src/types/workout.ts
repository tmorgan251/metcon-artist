export type WorkoutStructure = 'single' | 'couplet' | 'triplet' | 'chipper';
export type Modality = 'W' | 'G' | 'M';
export type TimeDomain = 'short' | 'medium' | 'long';

// Workout types for different modalities
// Note: emom includes both EMOM and E2MOM (user decides)
// Note: for_time includes for_time, for_time_or_not, and not_for_time (user decides)
export type WeightliftingWorkoutType = 'sets' | 'emom' | 'benchmark' | 'for_time_reps';
export type GymnasticsWorkoutType = 'for_time' | 'rounds_for_time' | 'amrap' | 'intervals' | 'emom' | 'benchmark' | 'skill';
export type MonostructuralWorkoutType = 'benchmark' | 'intervals' | 'for_time' | 'rounds_for_time';
export type CoupletWorkoutType = 'for_time' | 'rounds_for_time' | 'amrap' | 'intervals' | 'emom' | 'benchmark';
export type TripletWorkoutType = 'for_time' | 'rounds_for_time' | 'amrap' | 'intervals' | 'emom' | 'benchmark';

export type WorkoutType = WeightliftingWorkoutType | GymnasticsWorkoutType | MonostructuralWorkoutType | CoupletWorkoutType | TripletWorkoutType;

export interface Workout {
  structure: WorkoutStructure;
  modalities: Modality[];
  timeDomain: TimeDomain;
  workoutType: WorkoutType;
  name?: string;
}

export interface WorkoutGenerator {
  generateWorkout(structure: WorkoutStructure): Workout;
  getModalityDescription(modality: Modality): string;
  getModalityColor(modality: Modality): string;
  getTimeDomainDescription(timeDomain: TimeDomain): string;
  getTimeDomainColor(timeDomain: TimeDomain): string;
  getWorkoutTypeDescription(workoutType: WorkoutType): string;
  getWorkoutTypeColor(workoutType: WorkoutType): string;
}
