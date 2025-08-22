import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  HowToUse: { theme: any };
};

type HowToUseScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HowToUse'>;
type HowToUseScreenRouteProp = RouteProp<RootStackParamList, 'HowToUse'>;

interface HowToUseScreenProps {
  navigation: HowToUseScreenNavigationProp;
  route: HowToUseScreenRouteProp;
}

export const HowToUseScreen: React.FC<HowToUseScreenProps> = ({ navigation, route }) => {
  const { theme } = route.params;
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style="light" backgroundColor={theme.background} />
      
      {/* Custom Header with Back Button */}
      <View style={[styles.header, { backgroundColor: theme.selection }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backButtonText, { color: theme.foreground }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.foreground }]}>How To Use</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={Platform.OS !== 'web'}
        alwaysBounceVertical={Platform.OS !== 'web'}
        nestedScrollEnabled={Platform.OS !== 'web'}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={true}
        directionalLockEnabled={Platform.OS !== 'web'}
        overScrollMode={Platform.OS === 'android' ? 'always' : 'auto'}
      >
          <Text style={[styles.sectionTitle, { color: theme.foreground }]}>Getting Started</Text>
          <Text style={[styles.bodyText, { color: theme.foreground }]}>
            This app generates CrossFit workout structures based on different modalities and time domains. 
            Select a workout structure to generate a complete workout plan.
          </Text>
          
          <Text style={[styles.sectionTitle, { color: theme.foreground }]}>Workout Structures</Text>
          <Text style={[styles.bodyText, { color: theme.foreground }]}>
            • <Text style={[styles.boldText, { color: theme.cyan }]}>Single Modality:</Text> One movement type (Weightlifting, Gymnastics, or Monostructural)
          </Text>
          <Text style={[styles.bodyText, { color: theme.foreground }]}>
            • <Text style={[styles.boldText, { color: theme.cyan }]}>Couplet:</Text> Two movements performed in sequence
          </Text>
          <Text style={[styles.bodyText, { color: theme.foreground }]}>
            • <Text style={[styles.boldText, { color: theme.cyan }]}>Triplet/Chipper:</Text> Three or more movements in sequence
          </Text>
          
          <Text style={[styles.sectionTitle, { color: theme.foreground }]}>Example Workouts</Text>
          
          <View style={[styles.exampleCard, { backgroundColor: theme.selection, borderColor: theme.comment }]}>
            <Text style={[styles.exampleTitle, { color: theme.foreground }]}>Single Modality - Weightlifting</Text>
            <Text style={[styles.exampleText, { color: theme.foreground }]}>Structure: Single</Text>
            <Text style={[styles.exampleText, { color: theme.foreground }]}>Modality: Weightlifting (W)</Text>
            <Text style={[styles.exampleText, { color: theme.foreground }]}>Type: Sets</Text>
            <Text style={[styles.exampleText, { color: theme.foreground }]}>Time Domain: Medium (8-20 min)</Text>
            <Text style={[styles.exampleText, { color: theme.foreground }]}>Example: 5x5 Back Squat @ 80%</Text>
          </View>
          
          <View style={[styles.exampleCard, { backgroundColor: theme.selection, borderColor: theme.comment }]}>
            <Text style={[styles.exampleTitle, { color: theme.foreground }]}>Couplet - Gymnastics + Monostructural</Text>
            <Text style={[styles.exampleText, { color: theme.foreground }]}>Structure: Couplet</Text>
            <Text style={[styles.exampleText, { color: theme.foreground }]}>Modalities: Gymnastics (G) + Monostructural (M)</Text>
            <Text style={[styles.exampleText, { color: theme.foreground }]}>Type: For Time</Text>
            <Text style={[styles.exampleText, { color: theme.foreground }]}>Time Domain: Short (&lt; 8 min)</Text>
            <Text style={[styles.exampleText, { color: theme.foreground }]}>Example: 10 rounds of 5 Pull-ups + 10 Burpees</Text>
          </View>
          
          <View style={[styles.exampleCard, { backgroundColor: theme.selection, borderColor: theme.comment }]}>
            <Text style={[styles.exampleTitle, { color: theme.foreground }]}>Chipper - Multiple Movements</Text>
            <Text style={[styles.exampleText, { color: theme.foreground }]}>Structure: Chipper</Text>
            <Text style={[styles.exampleText, { color: theme.foreground }]}>Type: For Time</Text>
            <Text style={[styles.exampleText, { color: theme.foreground }]}>Time Domain: Long (20+ min)</Text>
            <Text style={[styles.exampleText, { color: theme.foreground }]}>Example: 100 Thrusters, 80 Pull-ups, 60 Box Jumps, 40 Wall Balls, 20 Burpees</Text>
          </View>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'web' ? 10 : 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      height: '100%',
    } as any),
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    ...(Platform.OS === 'web' && {
      minHeight: '100%',
    }),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  boldText: {
    fontWeight: 'bold',
  },
  exampleCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    marginBottom: 4,
  },
});
