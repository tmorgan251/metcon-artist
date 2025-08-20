// Workout Creation Types
export type WorkoutScheme = 'single' | 'couplet' | 'triplet';
export type Modality = 'W' | 'G' | 'M';
export type TimeDomain = 'short' | 'medium' | 'long';

// Single workout types
export type SingleWorkoutType = 'sets' | 'emom' | 'for_time_reps' | 'for_time' | 'benchmark' | 'skill';

// Couplet/Triplet workout types
export type MultiWorkoutType = 'for_time' | 'amrap' | 'intervals' | 'benchmark';

// Union type for all workout types
export type WorkoutType = SingleWorkoutType | MultiWorkoutType;

// Exercise prescription
export interface ExercisePrescription {
  reps?: string;
  weight?: string;
  distance_m?: number;
  time_sec?: number;
  cals?: number;
}

// Exercise
export interface Exercise {
  name: string;
  prescription: ExercisePrescription;
}

// Type-specific specifications
export interface SetsSpec {
  set_scheme: string;
  intensity_hint?: string;
}

export interface EmomSpec {
  cadence_sec: 60 | 120 | 180;
  total_minutes: number;
}

export interface ForTimeRepsSpec {
  total_reps: number;
  time_cap_min: number;
}

export interface ForTimeSpec {
  rounds: number;
  time_cap_min: number;
}

export interface AmrapSpec {
  amrap_minutes: number;
}

export interface IntervalsSpec {
  work_sec: number;
  rest_sec: number;
  rounds: number;
}

export interface BenchmarkSpec {
  reference: string;
  format_hint: 'for_time' | 'amrap' | 'sets' | 'time_trial';
  time_cap_min: number;
}

export interface SkillSpec {
  structure: string;
  total_minutes: number;
}

// Union type for all specs
export type WorkoutSpec = 
  | SetsSpec 
  | EmomSpec 
  | ForTimeRepsSpec 
  | ForTimeSpec 
  | AmrapSpec 
  | IntervalsSpec 
  | BenchmarkSpec 
  | SkillSpec;

// Main workout interface
export interface CustomWorkout {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  scheme: WorkoutScheme;
  modalities: Modality[];
  type: WorkoutType;
  time_domain: TimeDomain;
  exercises: Exercise[];
  spec: WorkoutSpec;
  notes: string;
  created_at: string;
}

// Workout creation request
export interface CreateWorkoutRequest {
  scheme: WorkoutScheme;
  modalities: Modality[];
  type: WorkoutType;
  time_domain: TimeDomain;
}

// Workout creation response
export interface CreateWorkoutResponse {
  ok: boolean;
  needs?: string[];
  workout?: CustomWorkout;
}

// Logging Types
export type RxOrScaled = 0 | 1; // 0 = scaled, 1 = RX

// Type-specific result interfaces
export interface SetsResult {
  sets: Array<{ reps: number; weight_lb: number }>;
  best_single_lb: number;
}

export interface EmomResult {
  completed_minutes: number;
  failed_minutes: number[];
  total_reps: number;
}

export interface ForTimeRepsResult {
  finish_time_sec: number;
  capped: boolean;
}

export interface ForTimeResult {
  finish_time_sec: number;
  capped: boolean;
}

export interface AmrapResult {
  rounds: number;
  extra_reps: number;
}

export interface IntervalsResult {
  splits_sec: number[];
  best_sec: number;
  avg_sec: number;
}

export interface BenchmarkResult {
  is_pr: boolean;
  [key: string]: any; // Flexible for different benchmark formats
}

export interface SkillResult {
  total_practice_min: number;
  quality_1to5: number;
  best_hold_sec: number;
}

// Union type for all results
export type WorkoutResult = 
  | SetsResult 
  | EmomResult 
  | ForTimeRepsResult 
  | ForTimeResult 
  | AmrapResult 
  | IntervalsResult 
  | BenchmarkResult 
  | SkillResult;

// Workout log
export interface WorkoutLog {
  id: string;
  workout_id: string;
  date: string; // YYYY-MM-DD
  rx_or_scaled: RxOrScaled;
  result: WorkoutResult;
  notes: string;
  logged_at: string;
}

// Log response
export interface LogWorkoutResponse {
  ok: boolean;
  needs?: string[];
  log?: WorkoutLog;
}

// Calendar entry (workout with optional log)
export interface CalendarEntry {
  date: string;
  workout: CustomWorkout;
  log?: WorkoutLog;
}
