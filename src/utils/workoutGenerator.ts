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
        // Linchpin patterns: Short: 8%, Medium: 50%, Long: 42%
        if (random < 0.08) return 'short';
        if (random < 0.58) return 'medium';
        return 'long';
      
      case 'couplet':
        // Linchpin patterns: Short: 15%, Medium: 50%, Long: 35%
        if (random < 0.15) return 'short';
        if (random < 0.65) return 'medium';
        return 'long';
      
      case 'triplet':
        // Linchpin patterns: Short: 5%, Medium: 45%, Long: 50%
        if (random < 0.05) return 'short';
        if (random < 0.50) return 'medium';
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
    
    // Handle chipper case - Linchpin patterns: always for_time (user can choose to do for_time_or_not or not_for_time)
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
        // Linchpin patterns: sets: 0.40, emom: 0.45 (includes e2mom), benchmark: 0.10, for_time_reps: 0.05
        if (random < 0.40) return 'sets';
        if (random < 0.85) return 'emom'; // Combined emom + e2mom probabilities
        if (random < 0.95) return 'benchmark';
        return 'for_time_reps';
      
      case 'medium':
        // Linchpin patterns: sets: 0.50, emom: 0.35 (includes e2mom), benchmark: 0.10, for_time_reps: 0.05
        if (random < 0.50) return 'sets';
        if (random < 0.85) return 'emom'; // Combined emom + e2mom probabilities
        if (random < 0.95) return 'benchmark';
        return 'for_time_reps';
      
      case 'long':
        // Linchpin patterns: sets: 0.35, emom: 0.55 (includes e2mom), benchmark: 0.05, for_time_reps: 0.05
        if (random < 0.35) return 'sets';
        if (random < 0.90) return 'emom'; // Combined emom + e2mom probabilities
        if (random < 0.95) return 'benchmark';
        return 'for_time_reps';
      
      default:
        return 'sets';
    }
  }

  private generateGymnasticsWorkoutType(timeDomain: TimeDomain, random: number): WorkoutType {
    switch (timeDomain) {
      case 'short':
        // Linchpin patterns: for_time: 0.40 (includes for_time_or_not), rounds_for_time: 0.10, amrap: 0.15, intervals: 0.10, emom: 0.20 (includes e2mom), benchmark: 0.05, skill: 0.05
        if (random < 0.40) return 'for_time'; // Combined for_time + for_time_or_not probabilities
        if (random < 0.50) return 'rounds_for_time';
        if (random < 0.65) return 'amrap';
        if (random < 0.75) return 'intervals';
        if (random < 0.95) return 'emom'; // Combined emom + e2mom probabilities
        if (random < 0.98) return 'benchmark';
        return 'skill';
      
      case 'medium':
        // Linchpin patterns: for_time: 0.27 (includes for_time_or_not), rounds_for_time: 0.15, amrap: 0.25, intervals: 0.08, emom: 0.15 (includes e2mom), benchmark: 0.05, skill: 0.05
        if (random < 0.27) return 'for_time'; // Combined for_time + for_time_or_not probabilities
        if (random < 0.42) return 'rounds_for_time';
        if (random < 0.67) return 'amrap';
        if (random < 0.75) return 'intervals';
        if (random < 0.90) return 'emom'; // Combined emom + e2mom probabilities
        if (random < 0.95) return 'benchmark';
        return 'skill';
      
      case 'long':
        // Linchpin patterns: for_time: 0.20, rounds_for_time: 0.15, amrap: 0.30, intervals: 0.12, emom: 0.15 (includes e2mom), benchmark: 0.05, skill: 0.03
        if (random < 0.20) return 'for_time';
        if (random < 0.35) return 'rounds_for_time';
        if (random < 0.65) return 'amrap';
        if (random < 0.77) return 'intervals';
        if (random < 0.92) return 'emom'; // Combined emom + e2mom probabilities
        if (random < 0.97) return 'benchmark';
        return 'skill';
      
      default:
        return 'for_time';
    }
  }

  private generateMonostructuralWorkoutType(timeDomain: TimeDomain, random: number): WorkoutType {
    switch (timeDomain) {
      case 'short':
        // Linchpin patterns: benchmark: 0.40, intervals: 0.40, for_time: 0.15 (includes not_for_time), rounds_for_time: 0.05
        if (random < 0.40) return 'benchmark';
        if (random < 0.80) return 'intervals';
        if (random < 0.95) return 'for_time'; // Combined for_time + not_for_time probabilities
        return 'rounds_for_time';
      
      case 'medium':
        // Linchpin patterns: benchmark: 0.50, intervals: 0.30, for_time: 0.15 (includes not_for_time), rounds_for_time: 0.05
        if (random < 0.50) return 'benchmark';
        if (random < 0.80) return 'intervals';
        if (random < 0.95) return 'for_time'; // Combined for_time + not_for_time probabilities
        return 'rounds_for_time';
      
      case 'long':
        // Linchpin patterns: benchmark: 0.55, intervals: 0.30, for_time: 0.10 (includes not_for_time), rounds_for_time: 0.05
        if (random < 0.55) return 'benchmark';
        if (random < 0.85) return 'intervals';
        if (random < 0.95) return 'for_time'; // Combined for_time + not_for_time probabilities
        return 'rounds_for_time';
      
      default:
        return 'benchmark';
    }
  }

  private generateCoupletWorkoutType(timeDomain: TimeDomain, random: number): WorkoutType {
    switch (timeDomain) {
      case 'short':
        // Linchpin patterns: for_time: 0.40, rounds_for_time: 0.20, amrap: 0.20, intervals: 0.05, emom: 0.10 (includes e2mom), benchmark: 0.05
        if (random < 0.40) return 'for_time';
        if (random < 0.60) return 'rounds_for_time';
        if (random < 0.80) return 'amrap';
        if (random < 0.85) return 'intervals';
        if (random < 0.95) return 'emom'; // Combined emom + e2mom probabilities
        return 'benchmark';
      
      case 'medium':
        // Linchpin patterns: for_time: 0.30, rounds_for_time: 0.20, amrap: 0.30, intervals: 0.05, emom: 0.13 (includes e2mom), benchmark: 0.02
        if (random < 0.30) return 'for_time';
        if (random < 0.50) return 'rounds_for_time';
        if (random < 0.80) return 'amrap';
        if (random < 0.85) return 'intervals';
        if (random < 0.98) return 'emom'; // Combined emom + e2mom probabilities
        return 'benchmark';
      
      case 'long':
        // Linchpin patterns: for_time: 0.20, rounds_for_time: 0.15, amrap: 0.45, intervals: 0.08, emom: 0.10 (includes e2mom), benchmark: 0.02
        if (random < 0.20) return 'for_time';
        if (random < 0.35) return 'rounds_for_time';
        if (random < 0.80) return 'amrap';
        if (random < 0.88) return 'intervals';
        if (random < 0.98) return 'emom'; // Combined emom + e2mom probabilities
        return 'benchmark';
      
      default:
        return 'for_time';
    }
  }

  private generateTripletWorkoutType(timeDomain: TimeDomain, random: number): WorkoutType {
    switch (timeDomain) {
      case 'short':
        // Linchpin patterns: for_time: 0.35, rounds_for_time: 0.25, amrap: 0.25, intervals: 0.05, emom: 0.07 (includes e2mom), benchmark: 0.03
        if (random < 0.35) return 'for_time';
        if (random < 0.60) return 'rounds_for_time';
        if (random < 0.85) return 'amrap';
        if (random < 0.90) return 'intervals';
        if (random < 0.97) return 'emom'; // Combined emom + e2mom probabilities
        return 'benchmark';
      
      case 'medium':
        // Linchpin patterns: for_time: 0.25, rounds_for_time: 0.20, amrap: 0.35, intervals: 0.08, emom: 0.10 (includes e2mom), benchmark: 0.02
        if (random < 0.25) return 'for_time';
        if (random < 0.45) return 'rounds_for_time';
        if (random < 0.80) return 'amrap';
        if (random < 0.88) return 'intervals';
        if (random < 0.98) return 'emom'; // Combined emom + e2mom probabilities
        return 'benchmark';
      
      case 'long':
        // Linchpin patterns: for_time: 0.20, rounds_for_time: 0.15, amrap: 0.45, intervals: 0.10, emom: 0.09 (includes e2mom), benchmark: 0.01
        if (random < 0.20) return 'for_time';
        if (random < 0.35) return 'rounds_for_time';
        if (random < 0.80) return 'amrap';
        if (random < 0.90) return 'intervals';
        if (random < 0.99) return 'emom'; // Combined emom + e2mom probabilities
        return 'benchmark';
      
      default:
        return 'for_time';
    }
  }

  private generateSingleWorkout(): Workout {
    // Linchpin patterns: W: ~52%, M: ~43%, G: ~5% (pure gymnastics singlets are very rare)
    const random = Math.random();
    let modality: Modality;
    
    if (random < 0.52) {
      modality = 'W';
    } else if (random < 0.95) {
      modality = 'M';
    } else {
      modality = 'G';
    }
    
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
    // Linchpin patterns for couplets (all 9 combinations = 100%):
    // WG: 25%, GW: 12%, WM: 22%, MW: 11%, GM: 18%, MG: 9%, WW: 2%, GG: 1%, MM: 0%
    const random = Math.random();
    let selectedCombination: Modality[];
    
    if (random < 0.25) {
      selectedCombination = ['W', 'G'];
    } else if (random < 0.37) {
      selectedCombination = ['G', 'W'];
    } else if (random < 0.59) {
      selectedCombination = ['W', 'M'];
    } else if (random < 0.70) {
      selectedCombination = ['M', 'W'];
    } else if (random < 0.88) {
      selectedCombination = ['G', 'M'];
    } else if (random < 0.97) {
      selectedCombination = ['M', 'G'];
    } else if (random < 0.99) {
      selectedCombination = ['W', 'W'];
    } else {
      selectedCombination = ['G', 'G']; // MM is 0% so we skip it and use GG as the catch-all
    }
    
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
    // Linchpin patterns: ~10-12% chance for chipper (reduced from 20%)
    const isChipper = Math.random() < 0.12;
    
    if (isChipper) {
      // Always for_time (user can choose to do for_time_or_not or not_for_time)
      return {
        structure: 'chipper',
        modalities: [], // Chipper doesn't have specific modalities
        timeDomain: 'long', // Chipper is always long
        workoutType: 'for_time',
        name: 'Chipper'
      };
    }
    
    // Linchpin patterns for triplets (all 27 combinations = 100%):
    // Tri-modal WGM (6 combos): ~6.67% each = 40% total
    // Pure GGG: ~9%, Pure WWW: ~5.5%, Pure MMM: ~3%
    // Two W + one other (6 combos): ~3.33% each = 20% total
    // Two G + one other (6 combos): ~2% each = 12% total  
    // Two M + one other (6 combos): ~1.75% each = 10.5% total
    const random = Math.random();
    let selectedCombination: Modality[];
    
    // Tri-modal combinations (40% total - ~6.67% each)
    if (random < 0.0667) {
      selectedCombination = ['W', 'G', 'M'];
    } else if (random < 0.1334) {
      selectedCombination = ['W', 'M', 'G'];
    } else if (random < 0.2001) {
      selectedCombination = ['G', 'W', 'M'];
    } else if (random < 0.2668) {
      selectedCombination = ['G', 'M', 'W'];
    } else if (random < 0.3335) {
      selectedCombination = ['M', 'W', 'G'];
    } else if (random < 0.4002) {
      selectedCombination = ['M', 'G', 'W'];
    }
    // Pure combinations (17.5% total)
    else if (random < 0.4902) {
      selectedCombination = ['G', 'G', 'G']; // ~9%
    } else if (random < 0.5452) {
      selectedCombination = ['W', 'W', 'W']; // ~5.5%
    } else if (random < 0.5752) {
      selectedCombination = ['M', 'M', 'M']; // ~3%
    }
    // Two W + one other (20% total - 6 combinations, ~3.33% each)
    else if (random < 0.6085) {
      selectedCombination = ['W', 'W', 'G']; // ~3.33%
    } else if (random < 0.6418) {
      selectedCombination = ['W', 'W', 'M']; // ~3.33%
    } else if (random < 0.6751) {
      selectedCombination = ['W', 'G', 'W']; // ~3.33%
    } else if (random < 0.7084) {
      selectedCombination = ['W', 'M', 'W']; // ~3.33%
    } else if (random < 0.7417) {
      selectedCombination = ['G', 'W', 'W']; // ~3.33%
    } else if (random < 0.7750) {
      selectedCombination = ['M', 'W', 'W']; // ~3.33%
    }
    // Two G + one other (12% total - 6 combinations, ~2% each)
    else if (random < 0.7950) {
      selectedCombination = ['G', 'G', 'W']; // ~2%
    } else if (random < 0.8150) {
      selectedCombination = ['G', 'G', 'M']; // ~2%
    } else if (random < 0.8350) {
      selectedCombination = ['G', 'W', 'G']; // ~2%
    } else if (random < 0.8550) {
      selectedCombination = ['W', 'G', 'G']; // ~2%
    } else if (random < 0.8750) {
      selectedCombination = ['G', 'M', 'G']; // ~2%
    } else if (random < 0.8950) {
      selectedCombination = ['M', 'G', 'G']; // ~2%
    }
    // Two M + one other (10.5% total - 6 combinations, ~1.75% each)
    else if (random < 0.9125) {
      selectedCombination = ['M', 'M', 'W']; // ~1.75%
    } else if (random < 0.9300) {
      selectedCombination = ['M', 'M', 'G']; // ~1.75%
    } else if (random < 0.9475) {
      selectedCombination = ['M', 'W', 'M']; // ~1.75%
    } else if (random < 0.9650) {
      selectedCombination = ['W', 'M', 'M']; // ~1.75%
    } else if (random < 0.9825) {
      selectedCombination = ['M', 'G', 'M']; // ~1.75%
    } else {
      selectedCombination = ['G', 'M', 'M']; // ~1.75% (catch-all to ensure 100%)
    }
    
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
    // Always for_time (user can choose to do for_time_or_not or not_for_time)
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
      case 'emom': return 'EMOM (or E2MOM)';
      case 'benchmark': return 'Benchmark';
      case 'for_time_reps': return 'For Time/Reps';
      case 'for_time': return 'For Time (or not for time)';
      case 'rounds_for_time': return 'Rounds for Time';
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
      case 'rounds_for_time': return '#5AFF9B'; // Lighter Green
      case 'amrap': return '#FF79C6'; // Dracula Pink
      case 'intervals': return '#F1FA8C'; // Dracula Yellow
      case 'skill': return '#6272A4'; // Dracula Comment
      default: return '#6272A4'; // Dracula Comment
    }
  }
}
