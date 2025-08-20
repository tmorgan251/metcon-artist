# CrossFit WOD Generator

A React Native Android application that generates CrossFit workout structures based on different modalities and combinations.

## Features

### Workout Structures
- **Single Structure**: Generates a workout with one modality (W, G, or M)
- **Couplet**: Generates a workout with two modalities (all 9 possible combinations: WW, WG, WM, GW, GG, GM, MW, MG, MM)
- **Triplet**: Generates a workout with three modalities (all 27 possible combinations) + 20% chance for Chipper
- **Chipper**: Generates a chipper workout (multiple movements in sequence)

### Modalities
- **W (Weightlifting)**: Olympic lifts, powerlifting movements, kettlebell work
- **G (Gymnastics)**: Bodyweight movements, pull-ups, push-ups, handstands
- **M (Monostructural)**: Cardio movements, running, rowing, biking

### Time Domains
- **Short (< 8 min)**: High-intensity, quick workouts
- **Medium (8-20 min)**: Balanced intensity and duration
- **Long (20+ min)**: Endurance-focused workouts

### Workout Types
- **Sets**: Multiple sets of the same movement
- **EMOM**: Every Minute On the Minute
- **Benchmark**: Named CrossFit workouts
- **For Time/Reps**: Complete for time or reps
- **For Time**: Complete for time
- **AMRAP**: As Many Rounds/Reps As Possible
- **Intervals**: Work/rest intervals
- **Skill**: Skill development and practice

## How It Works

1. **Single Structure**: Randomly selects one modality from W, G, or M
2. **Couplet**: Randomly selects from all 9 possible double combinations (WW, WG, WM, GW, GG, GM, MW, MG, MM)
3. **Triplet**: Randomly selects from all 27 possible triple combinations with a 20% chance of generating a Chipper instead
4. **Chipper**: Generates a chipper workout without specific modality combinations

### Time Domain Distribution
Each workout structure has specific time domain weights:

- **Single**: Short 5%, Medium 45%, Long 50%
- **Couplet**: Short 25%, Medium 50%, Long 25%
- **Triplet**: Short 5%, Medium 35%, Long 60%
- **Chipper**: Always Long (100%)

### Workout Type Distribution
Workout types are generated based on modality and time domain:

**Weightlifting (W):**
- Short: Sets 45%, EMOM 35%, Benchmark 10%, For Time/Reps 10%
- Medium: Sets 65%, EMOM 20%, Benchmark 10%, For Time/Reps 5%
- Long: Sets 50%, EMOM 35%, Benchmark 5%, For Time/Reps 10%

**Gymnastics (G):**
- Short: For Time 35%, AMRAP 15%, Intervals 15%, EMOM 20%, Benchmark 5%, Skill 10%
- Medium: For Time 30%, AMRAP 35%, Intervals 10%, EMOM 10%, Benchmark 5%, Skill 10%
- Long: For Time 20%, AMRAP 40%, Intervals 15%, EMOM 10%, Benchmark 5%, Skill 10%

**Monostructural (M):**
- Short: Benchmark 45%, Intervals 45%, For Time 10%
- Medium: Benchmark 60%, Intervals 30%, For Time 10%
- Long: Benchmark 70%, Intervals 25%, For Time 5%

**Couplet:**
- Short: For Time 65%, AMRAP 25%, Intervals 5%, Benchmark 5%
- Medium: For Time 50%, AMRAP 40%, Intervals 5%, Benchmark 5%
- Long: For Time 25%, AMRAP 60%, Intervals 10%, Benchmark 5%

**Triplet:**
- Short: For Time 50%, AMRAP 35%, Intervals 10%, Benchmark 5%
- Medium: For Time 30%, AMRAP 55%, Intervals 10%, Benchmark 5%
- Long: For Time 15%, AMRAP 70%, Intervals 10%, Benchmark 5%

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CrossFitWOD
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on Android:
```bash
npm run android
```

### Alternative: Using Expo Go
1. Install Expo Go on your Android device
2. Run `npm start` in the project directory
3. Scan the QR code with Expo Go

### Quick Demo
To see the workout generation in action without running the full app:
```bash
node demo.js
```

This will generate sample workouts for all three structures and show you how the system works.

## Project Structure

```
CrossFitWOD/
├── App.tsx              # Main application component
├── demo.js              # Demo script for workout generation
├── package.json         # Dependencies and scripts
├── app.json            # Expo configuration
├── tsconfig.json       # TypeScript configuration
├── src/
│   ├── components/      # React components
│   │   └── WorkoutDisplay.tsx
│   ├── types/          # TypeScript type definitions
│   │   └── workout.ts
│   └── utils/          # Utility functions
│       ├── workoutGenerator.ts
│       └── __tests__/  # Test files
└── README.md           # This file
```

## Development

The application is built with:
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **React Hooks**: State management

## Customization

You can easily modify the application by:
- Adding new workout structures
- Changing modality combinations
- Adjusting the chipper probability
- Adding specific exercises for each modality
- Implementing workout timing and scoring

## Future Enhancements

- Add specific exercise suggestions for each modality
- Include workout timing and rep schemes
- Add workout history and favorites
- Implement difficulty levels
- Add timer functionality
- Include workout sharing capabilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
