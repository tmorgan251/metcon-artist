// Demo script to show CrossFit WOD generation
// Run with: node demo.js

class WorkoutGenerator {
  constructor() {
    this.modalities = ['W', 'G', 'M'];
  }

  generateWorkout(structure) {
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

  generateTimeDomain(structure) {
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

  generateWorkoutType(modality, timeDomain, structure) {
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

  generateWeightliftingWorkoutType(timeDomain, random) {
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

  generateGymnasticsWorkoutType(timeDomain, random) {
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
        // for_time: 0.20, amrap: 0.40, intervals: 0.15, emom: 0.10, benchmark: 0.05, skill: 0.10
        if (random < 0.20) return 'for_time';
        if (random < 0.60) return 'amrap';
        if (random < 0.75) return 'intervals';
        if (random < 0.85) return 'emom';
        if (random < 0.90) return 'benchmark';
        return 'skill';
      
      default:
        return 'for_time';
    }
  }

  generateMonostructuralWorkoutType(timeDomain, random) {
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

  generateCoupletWorkoutType(timeDomain, random) {
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

  generateTripletWorkoutType(timeDomain, random) {
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

  generateSingleWorkout() {
    const modality = this.modalities[Math.floor(Math.random() * this.modalities.length)];
    const timeDomain = this.generateTimeDomain('single');
    const workoutType = this.generateWorkoutType(modality, timeDomain, 'single');
    
    return {
      structure: 'single',
      modalities: [modality],
      timeDomain: timeDomain,
      workoutType: workoutType,
      name: `Single ${this.getModalityDescription(modality)}`
    };
  }

  generateCoupletWorkout() {
    // All possible couplet combinations: WW, WG, WM, GW, GG, GM, MW, MG, MM
    const coupletCombinations = [
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

  generateTripletWorkout() {
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
    const tripletCombinations = [
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

  generateChipperWorkout() {
    return {
      structure: 'chipper',
      modalities: [], // Chipper doesn't have specific modalities
      timeDomain: 'long', // Chipper is always long
      workoutType: 'for_time',
      name: 'Chipper'
    };
  }

  getModalityDescription(modality) {
    switch (modality) {
      case 'W': return 'Weightlifting';
      case 'G': return 'Gymnastics';
      case 'M': return 'Monostructural';
      default: return '';
    }
  }

  getTimeDomainDescription(timeDomain) {
    switch (timeDomain) {
      case 'short': return '< 8 min';
      case 'medium': return '8-20 min';
      case 'long': return '20+ min';
      default: return '';
    }
  }

  getWorkoutTypeDescription(workoutType) {
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
}

// Demo the workout generation
const generator = new WorkoutGenerator();

console.log('🏋️‍♂️ CrossFit WOD Generator Demo\n');

console.log('=== Single Structure Workouts ===');
for (let i = 0; i < 5; i++) {
  const workout = generator.generateWorkout('single');
  console.log(`${workout.name} (${workout.modalities.map(m => generator.getModalityDescription(m)).join(', ')}) - ${generator.getTimeDomainDescription(workout.timeDomain)} - ${generator.getWorkoutTypeDescription(workout.workoutType)}`);
}

console.log('\n=== Couplet Workouts (All 9 combinations possible) ===');
for (let i = 0; i < 10; i++) {
  const workout = generator.generateWorkout('couplet');
  console.log(`${workout.name} (${workout.modalities.map(m => generator.getModalityDescription(m)).join(', ')}) - ${generator.getTimeDomainDescription(workout.timeDomain)} - ${generator.getWorkoutTypeDescription(workout.workoutType)}`);
}

console.log('\n=== Triplet Workouts (All 27 combinations + 20% chance for Chipper) ===');
for (let i = 0; i < 15; i++) {
  const workout = generator.generateWorkout('triplet');
  if (workout.structure === 'chipper') {
    console.log(`${workout.name} - Multiple movements in sequence - ${generator.getTimeDomainDescription(workout.timeDomain)} - ${generator.getWorkoutTypeDescription(workout.workoutType)}`);
  } else {
    console.log(`${workout.name} (${workout.modalities.map(m => generator.getModalityDescription(m)).join(', ')}) - ${generator.getTimeDomainDescription(workout.timeDomain)} - ${generator.getWorkoutTypeDescription(workout.workoutType)}`);
  }
}

console.log('\n=== All Possible Couplet Combinations ===');
const coupletCombinations = [
  ['W', 'W'], ['W', 'G'], ['W', 'M'],
  ['G', 'W'], ['G', 'G'], ['G', 'M'],
  ['M', 'W'], ['M', 'G'], ['M', 'M']
];

coupletCombinations.forEach((combo, index) => {
  console.log(`${index + 1}. ${combo.join(' + ')} (${combo.map(m => generator.getModalityDescription(m)).join(', ')})`);
});

console.log('\n=== Time Domain Weights ===');
console.log('Single: Short 5%, Medium 45%, Long 50%');
console.log('Couplet: Short 25%, Medium 50%, Long 25%');
console.log('Triplet: Short 5%, Medium 35%, Long 60%');
console.log('Chipper: Always Long');

console.log('\n=== Workout Type Weights by Modality & Time Domain ===');
console.log('Weightlifting (W):');
console.log('  Short: Sets 45%, EMOM 35%, Benchmark 10%, For Time/Reps 10%');
console.log('  Medium: Sets 65%, EMOM 20%, Benchmark 10%, For Time/Reps 5%');
console.log('  Long: Sets 50%, EMOM 35%, Benchmark 5%, For Time/Reps 10%');
console.log('Gymnastics (G):');
console.log('  Short: For Time 35%, AMRAP 15%, Intervals 15%, EMOM 20%, Benchmark 5%, Skill 10%');
console.log('  Medium: For Time 30%, AMRAP 35%, Intervals 10%, EMOM 10%, Benchmark 5%, Skill 10%');
console.log('  Long: For Time 20%, AMRAP 40%, Intervals 15%, EMOM 10%, Benchmark 5%, Skill 10%');
console.log('Monostructural (M):');
console.log('  Short: Benchmark 45%, Intervals 45%, For Time 10%');
console.log('  Medium: Benchmark 60%, Intervals 30%, For Time 10%');
console.log('  Long: Benchmark 70%, Intervals 25%, For Time 5%');
console.log('Couplet:');
console.log('  Short: For Time 65%, AMRAP 25%, Intervals 5%, Benchmark 5%');
console.log('  Medium: For Time 50%, AMRAP 40%, Intervals 5%, Benchmark 5%');
console.log('  Long: For Time 25%, AMRAP 60%, Intervals 10%, Benchmark 5%');
console.log('Triplet:');
console.log('  Short: For Time 50%, AMRAP 35%, Intervals 10%, Benchmark 5%');
console.log('  Medium: For Time 30%, AMRAP 55%, Intervals 10%, Benchmark 5%');
console.log('  Long: For Time 15%, AMRAP 70%, Intervals 10%, Benchmark 5%');

console.log('\n=== Modality Legend ===');
console.log('W - Weightlifting (Olympic lifts, powerlifting, kettlebells)');
console.log('G - Gymnastics (Bodyweight movements, pull-ups, push-ups)');
console.log('M - Monostructural (Cardio, running, rowing, biking)');
console.log('Chipper - Multiple movements performed in sequence');

console.log('\n=== Time Domain Legend ===');
console.log('Short - < 8 min');
console.log('Medium - 8-20 min');
console.log('Long - 20+ min');

console.log('\n=== Workout Type Legend ===');
console.log('Sets - Multiple sets of the same movement');
console.log('EMOM - Every Minute On the Minute');
console.log('Benchmark - Named CrossFit workouts');
console.log('For Time/Reps - Complete for time or reps');
console.log('For Time - Complete for time');
console.log('AMRAP - As Many Rounds/Reps As Possible');
console.log('Intervals - Work/rest intervals');
console.log('Skill - Skill development and practice');
