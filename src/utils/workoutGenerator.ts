import { WorkoutStructure, Modality, Workout, TimeDomain, WorkoutType } from '../types/workout';

export class WorkoutGenerator {
  private modalities: Modality[] = ['W', 'G', 'M'];

  generateWorkout(structure: WorkoutStructure): Workout {
    switch (structure) {
      case 'single':
        return this.generateSingleWorkout();
      
      case 'couplet':
        return this.generateCoupletWorkout();
      
      case 'triplet':
        return this.generateTripletWorkout();
      
      case 'chipper':
        return this.generateChipperWorkout();
      
      default:
        return this.generateSingleWorkout();
    }
  }

  private generateTimeDomain(structure: WorkoutStructure): TimeDomain {
    const random = Math.random();
    
    switch (structure) {
      case 'single':
        // Short: 5%, Medium: 45%, Long: 50%
        if (random < 0.05) return 'short';
        if (random < 0.50) return 'medium';
        return 'long';
      
      case 'couplet':
        // Short: 25%, Medium: 50%, Long: 25%
        if (random < 0.25) return 'short';
        if (random < 0.75) return 'medium';
        return 'long';
      
      case 'triplet':
        // Short: 5%, Medium: 35%, Long: 60%
        if (random < 0.05) return 'short';
        if (random < 0.40) return 'medium';
        return 'long';
      
      case 'chipper':
        // Always long
        return 'long';
      
      default:
        return 'medium';
    }
  }

  private generateWorkoutType(modality: Modality, timeDomain: TimeDomain, structure: WorkoutStructure): WorkoutType {
    const random = Math.random();
    
    // Handle chipper case
    if (structure === 'chipper') {
      return 'for_time';
    }
    
    // Handle couplet and triplet cases
    if (structure === 'couplet') {
      return this.generateCoupletWorkoutType(timeDomain, random);
    }
    
    if (structure === 'triplet') {
      return this.generateTripletWorkoutType(timeDomain, random);
    }
    
    // Handle single modality cases
    switch (modality) {
      case 'W':
        return this.generateWeightliftingWorkoutType(timeDomain, random);
      case 'G':
        return this.generateGymnasticsWorkoutType(timeDomain, random);
      case 'M':
        return this.generateMonostructuralWorkoutType(timeDomain, random);
      default:
        return 'for_time';
    }
  }

  private generateWeightliftingWorkoutType(timeDomain: TimeDomain, random: number): WorkoutType {
    switch (timeDomain) {
      case 'short':
        // sets: 0.45, emom: 0.35, benchmark: 0.10, for_time_reps: 0.10
        if (random < 0.45) return 'sets';
        if (random < 0.80) return 'emom';
        if (random < 0.90) return 'benchmark';
        return 'for_time_reps';
      
      case 'medium':
        // sets: 0.65, emom: 0.20, benchmark: 0.10, for_time_reps: 0.05
        if (random < 0.65) return 'sets';
        if (random < 0.85) return 'emom';
        if (random < 0.95) return 'benchmark';
        return 'for_time_reps';
      
      case 'long':
        // sets: 0.50, emom: 0.35, benchmark: 0.05, for_time_reps: 0.10
        if (random < 0.50) return 'sets';
        if (random < 0.85) return 'emom';
        if (random < 0.90) return 'benchmark';
        return 'for_time_reps';
      
      default:
        return 'sets';
    }
  }

  private generateGymnasticsWorkoutType(timeDomain: TimeDomain, random: number): WorkoutType {
    switch (timeDomain) {
      case 'short':
        // for_time: 0.35, amrap: 0.15, intervals: 0.15, emom: 0.20, benchmark: 0.05, skill: 0.10
        if (random < 0.35) return 'for_time';
        if (random < 0.50) return 'amrap';
        if (random < 0.65) return 'intervals';
        if (random < 0.85) return 'emom';
        if (random < 0.90) return 'benchmark';
        return 'skill';
      
      case 'medium':
        // for_time: 0.30, amrap: 0.35, intervals: 0.10, emom: 0.10, benchmark: 0.05, skill: 0.10
        if (random < 0.30) return 'for_time';
        if (random < 0.65) return 'amrap';
        if (random < 0.75) return 'intervals';
        if (random < 0.85) return 'emom';
        if (random < 0.90) return 'benchmark';
        return 'skill';
      
      case 'long':
        // for_time: 0.30, intervals: 0.20, emom: 0.25, benchmark: 0.10, skill: 0.15
        //if (random < 0.30) return 'for_time';
        if (random < 0.35) return 'intervals';
        if (random < 0.75) return 'emom';
        if (random < 0.85) return 'benchmark';
        return 'skill';
      
      default:
        return 'for_time';
    }
  }

  private generateMonostructuralWorkoutType(timeDomain: TimeDomain, random: number): WorkoutType {
    switch (timeDomain) {
      case 'short':
        // benchmark: 0.45, intervals: 0.45, for_time: 0.10
        if (random < 0.45) return 'benchmark';
        if (random < 0.90) return 'intervals';
        return 'for_time';
      
      case 'medium':
        // benchmark: 0.60, intervals: 0.30, for_time: 0.10
        if (random < 0.60) return 'benchmark';
        if (random < 0.90) return 'intervals';
        return 'for_time';
      
      case 'long':
        // benchmark: 0.70, intervals: 0.25, for_time: 0.05
        if (random < 0.70) return 'benchmark';
        if (random < 0.95) return 'intervals';
        return 'for_time';
      
      default:
        return 'benchmark';
    }
  }

  private generateCoupletWorkoutType(timeDomain: TimeDomain, random: number): WorkoutType {
    switch (timeDomain) {
      case 'short':
        // for_time: 0.65, amrap: 0.25, intervals: 0.05, benchmark: 0.05
        if (random < 0.65) return 'for_time';
        if (random < 0.90) return 'amrap';
        if (random < 0.95) return 'intervals';
        return 'benchmark';
      
      case 'medium':
        // for_time: 0.50, amrap: 0.40, intervals: 0.05, benchmark: 0.05
        if (random < 0.50) return 'for_time';
        if (random < 0.90) return 'amrap';
        if (random < 0.95) return 'intervals';
        return 'benchmark';
      
      case 'long':
        // for_time: 0.25, amrap: 0.60, intervals: 0.10, benchmark: 0.05
        if (random < 0.25) return 'for_time';
        if (random < 0.85) return 'amrap';
        if (random < 0.95) return 'intervals';
        return 'benchmark';
      
      default:
        return 'for_time';
    }
  }

  private generateTripletWorkoutType(timeDomain: TimeDomain, random: number): WorkoutType {
    switch (timeDomain) {
      case 'short':
        // for_time: 0.50, amrap: 0.35, intervals: 0.10, benchmark: 0.05
        if (random < 0.50) return 'for_time';
        if (random < 0.85) return 'amrap';
        if (random < 0.95) return 'intervals';
        return 'benchmark';
      
      case 'medium':
        // for_time: 0.30, amrap: 0.55, intervals: 0.10, benchmark: 0.05
        if (random < 0.30) return 'for_time';
        if (random < 0.85) return 'amrap';
        if (random < 0.95) return 'intervals';
        return 'benchmark';
      
      case 'long':
        // for_time: 0.15, amrap: 0.70, intervals: 0.10, benchmark: 0.05
        if (random < 0.15) return 'for_time';
        if (random < 0.85) return 'amrap';
        if (random < 0.95) return 'intervals';
        return 'benchmark';
      
      default:
        return 'for_time';
    }
  }

  private generateSingleWorkout(): Workout {
    const modality = this.modalities[Math.floor(Math.random() * this.modalities.length)];
    const timeDomain = this.generateTimeDomain('single');
    const workoutType = this.generateWorkoutType(modality, timeDomain, 'single');
    
    return {
      structure: 'single',
      modalities: [modality],
      timeDomain: timeDomain,
      workoutType: workoutType,
      name: `${this.getModalityDescription(modality)}`
    };
  }

  private generateCoupletWorkout(): Workout {
    // All possible couplet combinations: WW, WG, WM, GW, GG, GM, MW, MG, MM
    const coupletCombinations: Modality[][] = [
      ['W', 'W'], ['W', 'G'], ['W', 'M'],
      ['G', 'W'], ['G', 'G'], ['G', 'M'],
      ['M', 'W'], ['M', 'G'], ['M', 'M']
    ];
    
    const selectedCombination = coupletCombinations[Math.floor(Math.random() * coupletCombinations.length)];
    const timeDomain = this.generateTimeDomain('couplet');
    const workoutType = this.generateWorkoutType(selectedCombination[0], timeDomain, 'couplet');
    
    return {
      structure: 'couplet',
      modalities: selectedCombination,
      timeDomain: timeDomain,
      workoutType: workoutType,
      name: 'Couplet'
    };
  }

  private generateTripletWorkout(): Workout {
    // Add 20% chance for chipper
    const isChipper = Math.random() < 0.2;
    
    if (isChipper) {
      return {
        structure: 'chipper',
        modalities: [], // Chipper doesn't have specific modalities
        timeDomain: 'long', // Chipper is always long
        workoutType: 'for_time',
        name: 'Chipper'
      };
    }
    
    // All possible triplet combinations (27 total)
    const tripletCombinations: Modality[][] = [
      // W first
      ['W', 'W', 'W'], ['W', 'W', 'G'], ['W', 'W', 'M'],
      ['W', 'G', 'W'], ['W', 'G', 'G'], ['W', 'G', 'M'],
      ['W', 'M', 'W'], ['W', 'M', 'G'], ['W', 'M', 'M'],
      // G first
      ['G', 'W', 'W'], ['G', 'W', 'G'], ['G', 'W', 'M'],
      ['G', 'G', 'W'], ['G', 'G', 'G'], ['G', 'G', 'M'],
      ['G', 'M', 'W'], ['G', 'M', 'G'], ['G', 'M', 'M'],
      // M first
      ['M', 'W', 'W'], ['M', 'W', 'G'], ['M', 'W', 'M'],
      ['M', 'G', 'W'], ['M', 'G', 'G'], ['M', 'G', 'M'],
      ['M', 'M', 'W'], ['M', 'M', 'G'], ['M', 'M', 'M']
    ];
    
    const selectedCombination = tripletCombinations[Math.floor(Math.random() * tripletCombinations.length)];
    const timeDomain = this.generateTimeDomain('triplet');
    const workoutType = this.generateWorkoutType(selectedCombination[0], timeDomain, 'triplet');
    
    return {
      structure: 'triplet',
      modalities: selectedCombination,
      timeDomain: timeDomain,
      workoutType: workoutType,
      name: 'Triplet'
    };
  }

  private generateChipperWorkout(): Workout {
    return {
      structure: 'chipper',
      modalities: [], // Chipper doesn't have specific modalities
      timeDomain: 'long', // Chipper is always long
      workoutType: 'for_time',
      name: 'Chipper'
    };
  }

  getModalityDescription(modality: Modality): string {
    switch (modality) {
      case 'W': return 'Weightlifting';
      case 'G': return 'Gymnastics';
      case 'M': return 'Monostructural';
      default: return '';
    }
  }

  getModalityColor(modality: Modality): string {
    switch (modality) {
      case 'W': return '#FF5555'; // Dracula Red
      case 'G': return '#8BE9FD'; // Dracula Cyan
      case 'M': return '#50FA7B'; // Dracula Green
      default: return '#6272A4'; // Dracula Comment
    }
  }

  getTimeDomainDescription(timeDomain: TimeDomain): string {
    switch (timeDomain) {
      case 'short': return '< 8 min';
      case 'medium': return '8-20 min';
      case 'long': return '20+ min';
      default: return '';
    }
  }

  getTimeDomainColor(timeDomain: TimeDomain): string {
    switch (timeDomain) {
      case 'short': return '#F1FA8C'; // Dracula Yellow
      case 'medium': return '#FFB86C'; // Dracula Orange
      case 'long': return '#FF79C6'; // Dracula Pink
      default: return '#6272A4'; // Dracula Comment
    }
  }

  getWorkoutTypeDescription(workoutType: WorkoutType): string {
    switch (workoutType) {
      case 'sets': return 'Sets';
      case 'emom': return 'EMOM';
      case 'benchmark': return 'Benchmark';
      case 'for_time_reps': return 'For Time/Reps';
      case 'for_time': return 'For Time';
      case 'amrap': return 'AMRAP';
      case 'intervals': return 'Intervals';
      case 'skill': return 'Skill';
      default: return '';
    }
  }

  getWorkoutTypeColor(workoutType: WorkoutType): string {
    switch (workoutType) {
      case 'sets': return '#BD93F9'; // Dracula Purple
      case 'emom': return '#FF5555'; // Dracula Red
      case 'benchmark': return '#FFB86C'; // Dracula Orange
      case 'for_time_reps': return '#8BE9FD'; // Dracula Cyan
      case 'for_time': return '#50FA7B'; // Dracula Green
      case 'amrap': return '#FF79C6'; // Dracula Pink
      case 'intervals': return '#F1FA8C'; // Dracula Yellow
      case 'skill': return '#6272A4'; // Dracula Comment
      default: return '#6272A4'; // Dracula Comment
    }
  }
}
