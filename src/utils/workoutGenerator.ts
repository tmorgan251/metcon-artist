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

  private generateTimeDomain(structure: WorkoutStructure, modalities?: Modality[]): TimeDomain {
    const random = Math.random();
    
    switch (structure) {
      case 'single':
        // Linchpin patterns: Short: 8%, Medium: 50%, Long: 42%
        if (random < 0.08) return 'short';
        if (random < 0.58) return 'medium';
        return 'long';
      
      case 'couplet':
        // If modalities provided, use modality-specific time domain probabilities
        if (modalities && modalities.length === 2) {
          return this.generateCoupletTimeDomain(modalities, random);
        }
        // Fallback to general couplet patterns: Short: 15%, Medium: 50%, Long: 35%
        if (random < 0.15) return 'short';
        if (random < 0.65) return 'medium';
        return 'long';
      
      case 'triplet':
        // If modalities provided, use modality-specific time domain probabilities
        if (modalities && modalities.length === 3) {
          return this.generateTripletTimeDomain(modalities, random);
        }
        // Fallback to general triplet patterns: Short: 5%, Medium: 45%, Long: 50%
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

  private generateCoupletTimeDomain(modalities: Modality[], random: number): TimeDomain {
    const combo = modalities.join('');
    
    // Time domain probabilities by couplet combination based on Linchpin patterns
    // Format: [short%, medium%, long%]
    switch (combo) {
      case 'WG':
      case 'GW':
        // Weightlifting + Gymnastics: Tends toward medium-long due to technical complexity
        // Linchpin patterns: Short: 10%, Medium: 60%, Long: 30%
        if (random < 0.10) return 'short';
        if (random < 0.70) return 'medium';
        return 'long';
      
      case 'WM':
      case 'MW':
        // Weightlifting + Monostructural: Balanced, monostructural paces the workout
        // Linchpin patterns: Short: 20%, Medium: 55%, Long: 25%
        if (random < 0.20) return 'short';
        if (random < 0.75) return 'medium';
        return 'long';
      
      case 'GM':
      case 'MG':
        // Gymnastics + Monostructural: Endurance-focused, tends longer
        // Linchpin patterns: Short: 12%, Medium: 50%, Long: 38%
        if (random < 0.12) return 'short';
        if (random < 0.62) return 'medium';
        return 'long';
      
      case 'WW':
        // Pure Weightlifting: Shorter, strength-focused
        // Linchpin patterns: Short: 30%, Medium: 60%, Long: 10%
        if (random < 0.30) return 'short';
        if (random < 0.90) return 'medium';
        return 'long';
      
      case 'GG':
        // Pure Gymnastics: Variable but often medium
        // Linchpin patterns: Short: 25%, Medium: 55%, Long: 20%
        if (random < 0.25) return 'short';
        if (random < 0.80) return 'medium';
        return 'long';
      
      case 'MM':
        // Pure Monostructural: Rare, but when it occurs tends long
        // Linchpin patterns: Short: 5%, Medium: 35%, Long: 60%
        if (random < 0.05) return 'short';
        if (random < 0.40) return 'medium';
        return 'long';
      
      default:
        // Fallback to general couplet patterns
        if (random < 0.15) return 'short';
        if (random < 0.65) return 'medium';
        return 'long';
    }
  }

  private generateTripletTimeDomain(modalities: Modality[], random: number): TimeDomain {
    const combo = modalities.join('');
    const hasW = modalities.includes('W');
    const hasG = modalities.includes('G');
    const hasM = modalities.includes('M');
    
    // Check if it's tri-modal (WGM in any order)
    if (hasW && hasG && hasM) {
      // Tri-modal (WGM): Most common, balanced but tends medium-long
      // Linchpin patterns: Short: 3%, Medium: 48%, Long: 49%
      if (random < 0.03) return 'short';
      if (random < 0.51) return 'medium';
      return 'long';
    }
    
    // Two W + one other
    if (modalities.filter(m => m === 'W').length === 2) {
      // Two weightlifting + one other: Shorter due to heavy loading
      // Linchpin patterns: Short: 8%, Medium: 55%, Long: 37%
      if (random < 0.08) return 'short';
      if (random < 0.63) return 'medium';
      return 'long';
    }
    
    // Two G + one other
    if (modalities.filter(m => m === 'G').length === 2) {
      // Two gymnastics + one other: Variable
      // Linchpin patterns: Short: 7%, Medium: 48%, Long: 45%
      if (random < 0.07) return 'short';
      if (random < 0.55) return 'medium';
      return 'long';
    }
    
    // Two M + one other
    if (modalities.filter(m => m === 'M').length === 2) {
      // Two monostructural + one other: Longer due to endurance focus
      // Linchpin patterns: Short: 2%, Medium: 38%, Long: 60%
      if (random < 0.02) return 'short';
      if (random < 0.40) return 'medium';
      return 'long';
    }
    
    // Pure combinations (WWW, GGG, MMM)
    if (combo === 'WWW') {
      // Pure Weightlifting: Short-medium
      // Linchpin patterns: Short: 15%, Medium: 70%, Long: 15%
      if (random < 0.15) return 'short';
      if (random < 0.85) return 'medium';
      return 'long';
    }
    
    if (combo === 'GGG') {
      // Pure Gymnastics: Medium
      // Linchpin patterns: Short: 10%, Medium: 60%, Long: 30%
      if (random < 0.10) return 'short';
      if (random < 0.70) return 'medium';
      return 'long';
    }
    
    if (combo === 'MMM') {
      // Pure Monostructural: Always long
      // Linchpin patterns: Short: 0%, Medium: 20%, Long: 80%
      if (random < 0.20) return 'medium';
      return 'long';
    }
    
    // Fallback to general triplet patterns
    if (random < 0.05) return 'short';
    if (random < 0.50) return 'medium';
    return 'long';
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
    // Evenly distributed: 33.33% each (W, G, M)
    const random = Math.random();
    let modality: Modality;
    
    if (random < 0.333333) {
      modality = 'W';
    } else if (random < 0.666667) {
      modality = 'G';
    } else {
      modality = 'M';
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
    // Evenly distributed: 9 combinations = ~11.11% each (1/9 = 0.111111)
    // All couplet combinations: WG, GW, WM, MW, GM, MG, WW, GG, MM
    const random = Math.random();
    let selectedCombination: Modality[];
    
    if (random < 0.111111) {
      selectedCombination = ['W', 'G'];
    } else if (random < 0.222222) {
      selectedCombination = ['G', 'W'];
    } else if (random < 0.333333) {
      selectedCombination = ['W', 'M'];
    } else if (random < 0.444444) {
      selectedCombination = ['M', 'W'];
    } else if (random < 0.555556) {
      selectedCombination = ['G', 'M'];
    } else if (random < 0.666667) {
      selectedCombination = ['M', 'G'];
    } else if (random < 0.777778) {
      selectedCombination = ['W', 'W'];
    } else if (random < 0.888889) {
      selectedCombination = ['G', 'G'];
    } else {
      selectedCombination = ['M', 'M'];
    }
    
    const timeDomain = this.generateTimeDomain('couplet', selectedCombination);
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
    // Linchpin patterns: ~25% chance for chipper
    const isChipper = Math.random() < 0.25;
    
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
    
    // Evenly distributed: 27 combinations = ~3.70% each (1/27 = 0.037037)
    // All triplet combinations: WGM, WMG, GWM, GMW, MWG, MGW, WWW, GGG, MMM,
    // WWG, WWM, WGW, WMW, GWW, MWW, GGW, GGM, GWG, WGG, GMG, MGG, MMW, MMG, MWM, WMM, MGM, GMM
    const random = Math.random();
    let selectedCombination: Modality[];
    
    // Tri-modal combinations (6 combinations)
    if (random < 0.037037) {
      selectedCombination = ['W', 'G', 'M'];
    } else if (random < 0.074074) {
      selectedCombination = ['W', 'M', 'G'];
    } else if (random < 0.111111) {
      selectedCombination = ['G', 'W', 'M'];
    } else if (random < 0.148148) {
      selectedCombination = ['G', 'M', 'W'];
    } else if (random < 0.185185) {
      selectedCombination = ['M', 'W', 'G'];
    } else if (random < 0.222222) {
      selectedCombination = ['M', 'G', 'W'];
    }
    // Pure combinations (3 combinations)
    else if (random < 0.259259) {
      selectedCombination = ['W', 'W', 'W'];
    } else if (random < 0.296296) {
      selectedCombination = ['G', 'G', 'G'];
    } else if (random < 0.333333) {
      selectedCombination = ['M', 'M', 'M'];
    }
    // Two W + one other (6 combinations)
    else if (random < 0.370370) {
      selectedCombination = ['W', 'W', 'G'];
    } else if (random < 0.407407) {
      selectedCombination = ['W', 'W', 'M'];
    } else if (random < 0.444444) {
      selectedCombination = ['W', 'G', 'W'];
    } else if (random < 0.481481) {
      selectedCombination = ['W', 'M', 'W'];
    } else if (random < 0.518518) {
      selectedCombination = ['G', 'W', 'W'];
    } else if (random < 0.555556) {
      selectedCombination = ['M', 'W', 'W'];
    }
    // Two G + one other (6 combinations)
    else if (random < 0.592593) {
      selectedCombination = ['G', 'G', 'W'];
    } else if (random < 0.629630) {
      selectedCombination = ['G', 'G', 'M'];
    } else if (random < 0.666667) {
      selectedCombination = ['G', 'W', 'G'];
    } else if (random < 0.703704) {
      selectedCombination = ['W', 'G', 'G'];
    } else if (random < 0.740741) {
      selectedCombination = ['G', 'M', 'G'];
    } else if (random < 0.777778) {
      selectedCombination = ['M', 'G', 'G'];
    }
    // Two M + one other (6 combinations)
    else if (random < 0.814815) {
      selectedCombination = ['M', 'M', 'W'];
    } else if (random < 0.851852) {
      selectedCombination = ['M', 'M', 'G'];
    } else if (random < 0.888889) {
      selectedCombination = ['M', 'W', 'M'];
    } else if (random < 0.925926) {
      selectedCombination = ['W', 'M', 'M'];
    } else if (random < 0.962963) {
      selectedCombination = ['M', 'G', 'M'];
    } else {
      selectedCombination = ['G', 'M', 'M'];
    }
    
    const timeDomain = this.generateTimeDomain('triplet', selectedCombination);
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
