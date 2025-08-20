import {
  CreateWorkoutRequest,
  WorkoutScheme,
  Modality,
  WorkoutType,
  TimeDomain,
  SingleWorkoutType,
  MultiWorkoutType,
  CustomWorkout,
  WorkoutSpec,
  SetsSpec,
  EmomSpec,
  ForTimeRepsSpec,
  ForTimeSpec,
  AmrapSpec,
  IntervalsSpec,
  BenchmarkSpec,
  SkillSpec,
  Exercise
} from '../types/workoutCreation';

export class WorkoutValidator {
  static validateCreateRequest(request: Partial<CreateWorkoutRequest>): { ok: boolean; needs: string[] } {
    const needs: string[] = [];

    // Required fields
    if (!request.scheme) needs.push('scheme');
    if (!request.modalities || request.modalities.length === 0) needs.push('modalities');
    if (!request.type) needs.push('type');
    if (!request.time_domain) needs.push('time_domain');

    if (needs.length > 0) {
      return { ok: false, needs };
    }

    // Validate scheme
    if (!['single', 'couplet', 'triplet'].includes(request.scheme!)) {
      needs.push('valid_scheme');
    }

    // Validate modalities
    const validModalities = ['W', 'G', 'M'];
    if (!request.modalities!.every(m => validModalities.includes(m))) {
      needs.push('valid_modalities');
    }

    // Validate modality count based on scheme
    if (request.scheme === 'single' && request.modalities!.length !== 1) {
      needs.push('single_modality_count');
    }

    if (request.scheme === 'couplet' && request.modalities!.length !== 2) {
      needs.push('couplet_modality_count');
    }

    if (request.scheme === 'triplet' && request.modalities!.length !== 3) {
      needs.push('triplet_modality_count');
    }

    // Validate workout type based on scheme and modalities
    if (!this.isValidWorkoutType(request.scheme!, request.modalities!, request.type!)) {
      needs.push('valid_workout_type');
    }

    // Validate time domain
    if (!['short', 'medium', 'long'].includes(request.time_domain!)) {
      needs.push('valid_time_domain');
    }

    return { ok: needs.length === 0, needs };
  }

  private static isValidWorkoutType(scheme: WorkoutScheme, modalities: Modality[], type: WorkoutType): boolean {
    const singleTypes: SingleWorkoutType[] = ['sets', 'emom', 'for_time_reps', 'for_time', 'benchmark', 'skill'];
    const multiTypes: MultiWorkoutType[] = ['for_time', 'amrap', 'intervals', 'benchmark'];

    if (scheme === 'single') {
      // Single M cannot have AMRAP
      if (modalities[0] === 'M' && type === 'amrap') {
        return false;
      }

      // Skill only allowed for single G
      if (type === 'skill' && modalities[0] !== 'G') {
        return false;
      }

      return singleTypes.includes(type as SingleWorkoutType);
    } else {
      // Couplet and triplet must use multi types
      return multiTypes.includes(type as MultiWorkoutType);
    }
  }

  static validateWorkoutSpec(type: WorkoutType, spec: any): { ok: boolean; needs: string[] } {
    const needs: string[] = [];

    switch (type) {
      case 'sets':
        if (!spec.set_scheme) needs.push('set_scheme');
        break;

      case 'emom':
        if (!spec.cadence_sec || ![60, 120, 180].includes(spec.cadence_sec)) {
          needs.push('valid_cadence_sec');
        }
        if (!spec.total_minutes || spec.total_minutes <= 0) {
          needs.push('total_minutes');
        }
        break;

      case 'for_time_reps':
        if (!spec.total_reps || spec.total_reps <= 0) needs.push('total_reps');
        if (!spec.time_cap_min || spec.time_cap_min <= 0) needs.push('time_cap_min');
        break;

      case 'for_time':
        if (!spec.rounds || spec.rounds <= 0) needs.push('rounds');
        if (!spec.time_cap_min || spec.time_cap_min <= 0) needs.push('time_cap_min');
        break;

      case 'amrap':
        if (!spec.amrap_minutes || spec.amrap_minutes <= 0) needs.push('amrap_minutes');
        break;

      case 'intervals':
        if (!spec.work_sec || spec.work_sec <= 0) needs.push('work_sec');
        if (!spec.rest_sec || spec.rest_sec < 0) needs.push('rest_sec');
        if (!spec.rounds || spec.rounds <= 0) needs.push('rounds');
        break;

      case 'benchmark':
        if (!spec.reference) needs.push('reference');
        if (!spec.format_hint || !['for_time', 'amrap', 'sets', 'time_trial'].includes(spec.format_hint)) {
          needs.push('valid_format_hint');
        }
        if (!spec.time_cap_min || spec.time_cap_min <= 0) needs.push('time_cap_min');
        break;

      case 'skill':
        if (!spec.structure) needs.push('structure');
        if (!spec.total_minutes || spec.total_minutes <= 0) needs.push('total_minutes');
        break;
    }

    return { ok: needs.length === 0, needs };
  }

  static validateExercises(exercises: Exercise[]): { ok: boolean; needs: string[] } {
    const needs: string[] = [];

    if (!exercises || exercises.length === 0) {
      needs.push('exercises');
      return { ok: false, needs };
    }

    exercises.forEach((exercise, index) => {
      if (!exercise.name || exercise.name.trim() === '') {
        needs.push(`exercise_${index}_name`);
      }
    });

    return { ok: needs.length === 0, needs };
  }

  static validateCompleteWorkout(workout: Partial<CustomWorkout>): { ok: boolean; needs: string[] } {
    const needs: string[] = [];

    // Basic validation
    if (!workout.title || workout.title.trim() === '') needs.push('title');
    if (!workout.date) needs.push('date');
    if (!workout.notes) needs.push('notes'); // notes can be empty string

    // Validate create request
    const createValidation = this.validateCreateRequest({
      scheme: workout.scheme,
      modalities: workout.modalities,
      type: workout.type,
      time_domain: workout.time_domain
    });

    if (!createValidation.ok) {
      needs.push(...createValidation.needs);
    }

    // Validate exercises
    const exerciseValidation = this.validateExercises(workout.exercises || []);
    if (!exerciseValidation.ok) {
      needs.push(...exerciseValidation.needs);
    }

    // Validate spec if type is provided
    if (workout.type && workout.spec) {
      const specValidation = this.validateWorkoutSpec(workout.type, workout.spec);
      if (!specValidation.ok) {
        needs.push(...specValidation.needs);
      }
    }

    return { ok: needs.length === 0, needs };
  }
}
