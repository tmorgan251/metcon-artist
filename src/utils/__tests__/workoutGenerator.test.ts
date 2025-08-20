import { WorkoutGenerator } from '../workoutGenerator';
import { WorkoutStructure } from '../../types/workout';

describe('WorkoutGenerator', () => {
  let workoutGenerator: WorkoutGenerator;

  beforeEach(() => {
    workoutGenerator = new WorkoutGenerator();
  });

  describe('generateWorkout', () => {
    it('should generate a single structure workout', () => {
      const workout = workoutGenerator.generateWorkout('single');
      
      expect(workout.structure).toBe('single');
      expect(workout.modalities).toHaveLength(1);
      expect(['W', 'G', 'M']).toContain(workout.modalities[0]);
      expect(workout.name).toMatch(/^Single [WGM]$/);
    });

    it('should generate a couplet workout', () => {
      const workout = workoutGenerator.generateWorkout('couplet');
      
      expect(workout.structure).toBe('couplet');
      expect(workout.modalities).toHaveLength(2);
      workout.modalities.forEach(modality => {
        expect(['W', 'G', 'M']).toContain(modality);
      });
      expect(workout.name).toMatch(/^Couplet: [WGM] \+ [WGM]$/);
    });

    it('should generate a triplet workout', () => {
      const workout = workoutGenerator.generateWorkout('triplet');
      
      expect(workout.structure).toBe('triplet');
      expect(workout.modalities).toHaveLength(3);
      workout.modalities.forEach(modality => {
        expect(['W', 'G', 'M']).toContain(modality);
      });
      expect(workout.name).toMatch(/^(Triplet|Chipper): [WGM] \+ [WGM] \+ [WGM]$/);
    });
  });

  describe('getModalityDescription', () => {
    it('should return correct descriptions for each modality', () => {
      expect(workoutGenerator.getModalityDescription('W')).toBe('Weightlifting');
      expect(workoutGenerator.getModalityDescription('G')).toBe('Gymnastics');
      expect(workoutGenerator.getModalityDescription('M')).toBe('Monostructural');
    });
  });

  describe('getModalityColor', () => {
    it('should return correct colors for each modality', () => {
      expect(workoutGenerator.getModalityColor('W')).toBe('#FF6B6B');
      expect(workoutGenerator.getModalityColor('G')).toBe('#4ECDC4');
      expect(workoutGenerator.getModalityColor('M')).toBe('#45B7D1');
    });
  });
});
