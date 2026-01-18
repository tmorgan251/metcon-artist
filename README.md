# CrossFit WOD Generator

A React Native Android application that generates CrossFit workout structures based on different modalities and combinations.

## Features

### Workout Structures
- **Single Structure**: Generates a workout with one modality (W, G, or M) - weighted toward W and M
- **Couplet**: Generates a workout with two modalities - favors mixed combinations (WG, WM, GM)
- **Triplet**: Generates a workout with three modalities - heavily favors tri-modal (WGM) combinations + 25% chance for Chipper
- **Chipper**: Generates a chipper workout (multiple movements in sequence)

**Note**: All probabilities are based on Pat Sherwood's CrossFit Linchpin programming patterns.

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
- **EMOM**: Every Minute On the Minute (or E2MOM - user chooses)
- **Benchmark**: Named CrossFit workouts
- **For Time/Reps**: Complete for time or reps
- **For Time**: Complete for time (or not for time - user chooses)
- **Rounds for Time**: Multiple rounds completed for time
- **AMRAP**: As Many Rounds/Reps As Possible
- **Intervals**: Work/rest intervals
- **Skill**: Skill development and practice

## How It Works

Based on CrossFit Linchpin programming patterns:

1. **Single Structure**: Weighted selection - W: 52%, M: 43%, G: 5% (pure gymnastics singlets are rare)
2. **Couplet**: Weighted selection favoring mixed modalities - WG: 25%, WM: 22%, GM: 18%, GW: 12%, MW: 11%, MG: 9%, WW: 2%, GG: 1%, MM: 0%
3. **Triplet**: Weighted selection heavily favoring tri-modal combinations - WGM variations: ~40%, GGG: ~9%, WWW: ~5.5%, MMM: ~3%, with 12% chance of Chipper
4. **Chipper**: Generates a chipper workout without specific modality combinations

### Time Domain Distribution
Each workout structure has specific time domain weights based on Linchpin patterns:

- **Single**: Short 8%, Medium 50%, Long 42%
- **Couplet**: Short 15%, Medium 50%, Long 35%
- **Triplet**: Short 5%, Medium 45%, Long 50%
- **Chipper**: Always Long (100%)

### Workout Type Distribution
Workout types are generated based on modality and time domain, following Linchpin patterns:

**Weightlifting (W):**
- Short: Sets 40%, EMOM 45% (includes E2MOM), Benchmark 10%, For Time/Reps 5%
- Medium: Sets 50%, EMOM 35% (includes E2MOM), Benchmark 10%, For Time/Reps 5%
- Long: Sets 35%, EMOM 55% (includes E2MOM), Benchmark 5%, For Time/Reps 5%

**Gymnastics (G):**
- Short: For Time 40% (includes for_time_or_not), Rounds for Time 10%, AMRAP 15%, Intervals 10%, EMOM 20% (includes E2MOM), Benchmark 5%, Skill 5%
- Medium: For Time 27% (includes for_time_or_not), Rounds for Time 15%, AMRAP 25%, Intervals 8%, EMOM 15% (includes E2MOM), Benchmark 5%, Skill 5%
- Long: For Time 20%, Rounds for Time 15%, AMRAP 30%, Intervals 12%, EMOM 15% (includes E2MOM), Benchmark 5%, Skill 3%

**Monostructural (M):**
- Short: Benchmark 40%, Intervals 40%, For Time 15% (includes not_for_time), Rounds for Time 5%
- Medium: Benchmark 50%, Intervals 30%, For Time 15% (includes not_for_time), Rounds for Time 5%
- Long: Benchmark 55%, Intervals 30%, For Time 10% (includes not_for_time), Rounds for Time 5%

**Couplet:**
- Short: For Time 40%, Rounds for Time 20%, AMRAP 20%, Intervals 5%, EMOM 10% (includes E2MOM), Benchmark 5%
- Medium: For Time 30%, Rounds for Time 20%, AMRAP 30%, Intervals 5%, EMOM 13% (includes E2MOM), Benchmark 2%
- Long: For Time 20%, Rounds for Time 15%, AMRAP 45%, Intervals 8%, EMOM 10% (includes E2MOM), Benchmark 2%

**Triplet:**
- Short: For Time 35%, Rounds for Time 25%, AMRAP 25%, Intervals 5%, EMOM 7% (includes E2MOM), Benchmark 3%
- Medium: For Time 25%, Rounds for Time 20%, AMRAP 35%, Intervals 8%, EMOM 10% (includes E2MOM), Benchmark 2%
- Long: For Time 20%, Rounds for Time 15%, AMRAP 45%, Intervals 10%, EMOM 9% (includes E2MOM), Benchmark 1%

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
