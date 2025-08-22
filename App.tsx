import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { WorkoutCreationScreen } from './src/screens/WorkoutCreationScreen';
import { WorkoutHistoryScreen } from './src/screens/WorkoutHistoryScreen';
import { WorkoutDetailScreen } from './src/screens/WorkoutDetailScreen';
import { HowToUseScreen } from './src/screens/HowToUseScreen';
import { CreateWorkoutRequest } from './src/types/workoutCreation';

type RootStackParamList = {
  Home: undefined;
  WorkoutCreation: { initialData: CreateWorkoutRequest };
  WorkoutHistory: undefined;
  WorkoutDetail: { workout: any };
  HowToUse: { theme: any };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen 
          name="WorkoutCreation" 
          component={WorkoutCreationScreen}
          options={{
            headerShown: true,
            title: 'Create Workout',
            headerStyle: {
              backgroundColor: '#44475A', // Dracula Selection
            },
            headerTintColor: '#F8F8F2', // Dracula Foreground
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
          name="WorkoutHistory" 
          component={WorkoutHistoryScreen}
          options={{
            headerShown: true,
            title: 'Workout History',
            headerStyle: {
              backgroundColor: '#44475A', // Dracula Selection
            },
            headerTintColor: '#F8F8F2', // Dracula Foreground
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
          name="WorkoutDetail" 
          component={WorkoutDetailScreen}
          options={{
            headerShown: true,
            title: 'Workout Details',
            headerStyle: {
              backgroundColor: '#44475A', // Dracula Selection
            },
            headerTintColor: '#F8F8F2', // Dracula Foreground
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
          name="HowToUse" 
          component={HowToUseScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
