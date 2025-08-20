import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CustomWorkout,
  WorkoutLog,
  CalendarEntry,
  CreateWorkoutRequest,
  WorkoutSpec,
  Exercise
} from '../types/workoutCreation';

export class WorkoutStorage {
  private static readonly WORKOUTS_KEY = 'crossfit_workouts';
  private static readonly LOGS_KEY = 'crossfit_logs';
  private static readonly EXERCISES_KEY = 'crossfit_exercises';

  // Generate unique ID
  private static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Workout Management
  static async saveWorkout(workout: Omit<CustomWorkout, 'id' | 'created_at'>): Promise<CustomWorkout> {
    try {
      const newWorkout: CustomWorkout = {
        ...workout,
        id: this.generateId(),
        created_at: new Date().toISOString()
      };

      const existingWorkouts = await this.getWorkouts();
      existingWorkouts.push(newWorkout);
      
      await AsyncStorage.setItem(this.WORKOUTS_KEY, JSON.stringify(existingWorkouts));
      return newWorkout;
    } catch (error) {
      console.error('Error saving workout:', error);
      throw new Error('Failed to save workout');
    }
  }

  static async getWorkouts(): Promise<CustomWorkout[]> {
    try {
      const workoutsJson = await AsyncStorage.getItem(this.WORKOUTS_KEY);
      return workoutsJson ? JSON.parse(workoutsJson) : [];
    } catch (error) {
      console.error('Error getting workouts:', error);
      return [];
    }
  }

  static async getWorkoutById(id: string): Promise<CustomWorkout | null> {
    try {
      const workouts = await this.getWorkouts();
      return workouts.find(w => w.id === id) || null;
    } catch (error) {
      console.error('Error getting workout by ID:', error);
      return null;
    }
  }

  static async updateWorkout(updatedWorkout: CustomWorkout): Promise<boolean> {
    try {
      const workouts = await this.getWorkouts();
      const workoutIndex = workouts.findIndex(w => w.id === updatedWorkout.id);
      
      if (workoutIndex === -1) {
        return false;
      }
      
      workouts[workoutIndex] = updatedWorkout;
      await AsyncStorage.setItem(this.WORKOUTS_KEY, JSON.stringify(workouts));
      return true;
    } catch (error) {
      console.error('Error updating workout:', error);
      return false;
    }
  }

  static async deleteWorkout(id: string): Promise<boolean> {
    try {
      const workouts = await this.getWorkouts();
      const filteredWorkouts = workouts.filter(w => w.id !== id);
      await AsyncStorage.setItem(this.WORKOUTS_KEY, JSON.stringify(filteredWorkouts));
      
      // Also delete associated logs
      const logs = await this.getLogs();
      const filteredLogs = logs.filter(l => l.workout_id !== id);
      await AsyncStorage.setItem(this.LOGS_KEY, JSON.stringify(filteredLogs));
      
      return true;
    } catch (error) {
      console.error('Error deleting workout:', error);
      return false;
    }
  }

  // Log Management
  static async saveLog(log: Omit<WorkoutLog, 'id' | 'logged_at'>): Promise<WorkoutLog> {
    try {
      const newLog: WorkoutLog = {
        ...log,
        id: this.generateId(),
        logged_at: new Date().toISOString()
      };

      const existingLogs = await this.getLogs();
      existingLogs.push(newLog);
      
      await AsyncStorage.setItem(this.LOGS_KEY, JSON.stringify(existingLogs));
      return newLog;
    } catch (error) {
      console.error('Error saving log:', error);
      throw new Error('Failed to save log');
    }
  }

  static async getLogs(): Promise<WorkoutLog[]> {
    try {
      const logsJson = await AsyncStorage.getItem(this.LOGS_KEY);
      return logsJson ? JSON.parse(logsJson) : [];
    } catch (error) {
      console.error('Error getting logs:', error);
      return [];
    }
  }

  static async getLogByWorkoutId(workoutId: string): Promise<WorkoutLog | null> {
    try {
      const logs = await this.getLogs();
      return logs.find(l => l.workout_id === workoutId) || null;
    } catch (error) {
      console.error('Error getting log by workout ID:', error);
      return null;
    }
  }

  static async deleteLog(id: string): Promise<boolean> {
    try {
      const logs = await this.getLogs();
      const filteredLogs = logs.filter(l => l.id !== id);
      await AsyncStorage.setItem(this.LOGS_KEY, JSON.stringify(filteredLogs));
      return true;
    } catch (error) {
      console.error('Error deleting log:', error);
      return false;
    }
  }

  // Calendar Management
  static async getCalendarEntries(): Promise<CalendarEntry[]> {
    try {
      const workouts = await this.getWorkouts();
      const logs = await this.getLogs();
      
      const entries: CalendarEntry[] = workouts.map(workout => {
        const log = logs.find(l => l.workout_id === workout.id);
        return {
          date: workout.date,
          workout,
          log: log || undefined
        };
      });

      // Sort by date (newest first)
      return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error getting calendar entries:', error);
      return [];
    }
  }

  static async getCalendarEntriesByMonth(year: number, month: number): Promise<CalendarEntry[]> {
    try {
      const allEntries = await this.getCalendarEntries();
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      return allEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate && entryDate <= endDate;
      });
    } catch (error) {
      console.error('Error getting calendar entries by month:', error);
      return [];
    }
  }

  static async getCalendarEntryByDate(date: string): Promise<CalendarEntry | null> {
    try {
      const entries = await this.getCalendarEntries();
      return entries.find(entry => entry.date === date) || null;
    } catch (error) {
      console.error('Error getting calendar entry by date:', error);
      return null;
    }
  }

  // Exercise Management
  static async saveExercise(exerciseName: string): Promise<void> {
    try {
      const exercises = await this.getExercises();
      if (!exercises.includes(exerciseName)) {
        exercises.push(exerciseName);
        await AsyncStorage.setItem(this.EXERCISES_KEY, JSON.stringify(exercises));
      }
    } catch (error) {
      console.error('Error saving exercise:', error);
    }
  }

  static async getExercises(): Promise<string[]> {
    try {
      const exercisesJson = await AsyncStorage.getItem(this.EXERCISES_KEY);
      return exercisesJson ? JSON.parse(exercisesJson) : [];
    } catch (error) {
      console.error('Error getting exercises:', error);
      return [];
    }
  }

  static async removeExercise(exerciseName: string): Promise<boolean> {
    try {
      const exercises = await this.getExercises();
      const filteredExercises = exercises.filter(e => e !== exerciseName);
      await AsyncStorage.setItem(this.EXERCISES_KEY, JSON.stringify(filteredExercises));
      return true;
    } catch (error) {
      console.error('Error removing exercise:', error);
      return false;
    }
  }

  // Utility methods
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.WORKOUTS_KEY, this.LOGS_KEY, this.EXERCISES_KEY]);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }

  static async getStats(): Promise<{
    totalWorkouts: number;
    totalLogs: number;
    uniqueExercises: number;
    lastWorkoutDate?: string;
  }> {
    try {
      const workouts = await this.getWorkouts();
      const logs = await this.getLogs();
      const exercises = await this.getExercises();

      const lastWorkout = workouts.length > 0 
        ? workouts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
        : null;

      return {
        totalWorkouts: workouts.length,
        totalLogs: logs.length,
        uniqueExercises: exercises.length,
        lastWorkoutDate: lastWorkout?.created_at
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        totalWorkouts: 0,
        totalLogs: 0,
        uniqueExercises: 0
      };
    }
  }
}
