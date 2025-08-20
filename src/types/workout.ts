export type WorkoutStructure = 'single' | 'couplet' | 'triplet' | 'chipper';
export type Modality = 'W' | 'G' | 'M';
export type TimeDomain = 'short' | 'medium' | 'long';

// Workout types for different modalities
export type WeightliftingWorkoutType = 'sets' | 'emom' | 'benchmark' | 'for_time_reps';
export type GymnasticsWorkoutType = 'for_time' | 'amrap' | 'intervals' | 'emom' | 'benchmark' | 'skill';
export type MonostructuralWorkoutType = 'benchmark' | 'intervals' | 'for_time';
export type CoupletWorkoutType = 'for_time' | 'amrap' | 'intervals' | 'benchmark';
export type TripletWorkoutType = 'for_time' | 'amrap' | 'intervals' | 'benchmark';

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
