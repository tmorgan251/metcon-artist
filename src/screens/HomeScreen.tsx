import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import { StackScreenProps } from '@react-navigation/stack';
import { WorkoutStructure, Workout } from '../types/workout';
import { WorkoutGenerator } from '../utils/workoutGenerator';
import { WorkoutDisplay } from '../components/WorkoutDisplay';
import { LegendModal } from '../components/LegendModal';
import { CreateWorkoutRequest } from '../types/workoutCreation';

type RootStackParamList = {
  Home: undefined;
  WorkoutCreation: { initialData: CreateWorkoutRequest };
  WorkoutHistory: undefined;
  WorkoutDetail: { workout: any };
  HowToUse: { theme: any };
};

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [selectedStructure, setSelectedStructure] = useState<WorkoutStructure | null>(null);
  const [generatedWorkout, setGeneratedWorkout] = useState<Workout | null>(null);
  const [workoutGenerator] = useState(() => new WorkoutGenerator());
  const [showLegendModal, setShowLegendModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dracula');
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // PWA Installation Logic
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Check if app is already installed
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
      if (!isInstalled) {
        setShowInstallButton(true);
      }

      // Listen for beforeinstallprompt event (Chrome/Android)
      const handleBeforeInstallPrompt = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowInstallButton(true);
      };

      // Check if we're on iOS Safari
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      
      if (isIOS && isSafari) {
        // On iOS Safari, show install button if not in standalone mode
        if (!isInstalled) {
          setShowInstallButton(true);
        }
      } else {
        // For other browsers, listen for beforeinstallprompt
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      }

      return () => {
        if (!isIOS || !isSafari) {
          window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        }
      };
    }
  }, []);

  const handleInstallApp = async () => {
    // Check if we're on iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    if (isIOS && isSafari) {
      // On iOS Safari, show instructions
      alert('To install this app:\n1. Tap the Share button (square with arrow)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to install');
    } else if (deferredPrompt) {
      // For Chrome/Android
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallButton(false);
        setDeferredPrompt(null);
      }
    } else {
      // Fallback for other browsers
      alert('Installation not available in this browser. Try Chrome or Safari.');
    }
  };

  const handleCopyWorkoutPrompt = async () => {
    if (!generatedWorkout) return;

    const workoutPrompt = `Generate a detailed CrossFit workout based on this structure:

Structure: ${generatedWorkout.structure}
Modalities: ${generatedWorkout.modalities.join(', ')}
Time Domain: ${workoutGenerator.getTimeDomainDescription(generatedWorkout.timeDomain)}
Workout Type: ${workoutGenerator.getWorkoutTypeDescription(generatedWorkout.workoutType)}

Please provide:
1. Specific exercises with reps/sets/weights
2. Workout flow and timing
3. Scaling options
4. Any special instructions or tips`;

    try {
      await Clipboard.setStringAsync(workoutPrompt);
      Alert.alert('Copied!', 'Workout prompt copied to clipboard. You can now paste it into ChatGPT or another AI.');
    } catch (error) {
      Alert.alert('Error', 'Could not copy to clipboard. Please copy manually.');
    }
  };

  // Theme color definitions
  const themes = {
    dracula: {
      background: '#282A36',
      selection: '#44475A',
      foreground: '#F8F8F2',
      comment: '#6272A4',
      red: '#FF5555',
      orange: '#FFB86C',
      yellow: '#F1FA8C',
      green: '#50FA7B',
      cyan: '#8BE9FD',
      purple: '#BD93F9',
      pink: '#FF79C6',
    },
    'catppuccin-latte': {
      background: '#EFF1F5',
      selection: '#E6E9EF',
      foreground: '#4C4F69',
      comment: '#8C8FA1',
      red: '#D20F39',
      orange: '#FE640B',
      yellow: '#DF8E1D',
      green: '#40A02B',
      cyan: '#04A5E5',
      purple: '#8839EF',
      pink: '#E64553',
    },
    'catppuccin-frappe': {
      background: '#303446',
      selection: '#414559',
      foreground: '#C6D0F5',
      comment: '#8C8FA1',
      red: '#E78284',
      orange: '#EF9F76',
      yellow: '#E5C890',
      green: '#A6D189',
      cyan: '#81C8BE',
      purple: '#CA9EE6',
      pink: '#F4B8E4',
    },
    'catppuccin-macchiato': {
      background: '#24273A',
      selection: '#363A4F',
      foreground: '#F4F4F5', // Improved contrast - lighter foreground
      comment: '#A5A5AA', // Lighter comment color for better readability
      red: '#ED8796',
      orange: '#F5A97F',
      yellow: '#EED49F',
      green: '#A6DA95',
      cyan: '#8BD5CA',
      purple: '#C6A0F6',
      pink: '#F5BDE6',
    },
    nord: {
      background: '#2E3440',
      selection: '#3B4252',
      foreground: '#F8F9FA', // Improved contrast - lighter foreground
      comment: '#8F9BB3', // Lighter comment color for better readability
      red: '#BF616A',
      orange: '#D08770',
      yellow: '#EBCB8B',
      green: '#A3BE8C',
      cyan: '#88C0D0',
      purple: '#B48EAD',
      pink: '#BF616A',
    },
  };

  const theme = themes[currentTheme as keyof typeof themes];

  const handleStructureSelect = (structure: WorkoutStructure) => {
    setSelectedStructure(structure);
    const workout = workoutGenerator.generateWorkout(structure);
    setGeneratedWorkout(workout);
  };

  // Commented out workout creation functionality
  /*
  const handleCreateCustomWorkout = () => {
    if (!generatedWorkout) return;
    
    // Convert chipper structure to triplet scheme for the creation form
    const scheme = generatedWorkout.structure === 'chipper' ? 'triplet' : generatedWorkout.structure;
    
    const formData: CreateWorkoutRequest = {
      scheme: scheme as any,
      modalities: generatedWorkout.modalities,
      type: generatedWorkout.workoutType as any,
      time_domain: generatedWorkout.timeDomain
    };
    
    navigation.navigate('WorkoutCreation', { initialData: formData });
  };
  */

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style="light" backgroundColor={theme.selection} />
      
      {/* Header with hamburger menu */}
      <View style={[styles.header, { backgroundColor: theme.selection }]}>
        <View style={styles.headerContent}>
                      <TouchableOpacity 
              style={[styles.menuButton, { backgroundColor: `${theme.foreground}20` }]}
              onPress={() => setShowMenuModal(true)}
            >
              <Text style={[styles.menuIcon, { color: theme.foreground }]}>☰</Text>
            </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.foreground }]}>CrossFit WOD Generator</Text>
            <Text style={[styles.subtitle, { color: theme.comment }]}>Generate your workout structure</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        bounces={true}
        alwaysBounceVertical={true}
        nestedScrollEnabled={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.structureSection}>
          <Text style={[styles.sectionTitle, { color: theme.foreground }]}>Select Workout Structure</Text>
          
                      <TouchableOpacity
              style={[
                styles.structureButton,
                { backgroundColor: theme.selection },
                selectedStructure === 'single' && { backgroundColor: theme.purple }
              ]}
              onPress={() => handleStructureSelect('single')}
            >
              <Text style={[
                styles.structureButtonText,
                { color: theme.foreground },
                selectedStructure === 'single' && { color: theme.background }
              ]}>
                Single Modality
              </Text>
            </TouchableOpacity>

                      <TouchableOpacity
              style={[
                styles.structureButton,
                { backgroundColor: theme.selection },
                selectedStructure === 'couplet' && { backgroundColor: theme.purple }
              ]}
              onPress={() => handleStructureSelect('couplet')}
            >
              <Text style={[
                styles.structureButtonText,
                { color: theme.foreground },
                selectedStructure === 'couplet' && { color: theme.background }
              ]}>
                Couplet
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.structureButton,
                { backgroundColor: theme.selection },
                selectedStructure === 'triplet' && { backgroundColor: theme.purple }
              ]}
              onPress={() => handleStructureSelect('triplet')}
            >
              <Text style={[
                styles.structureButtonText,
                { color: theme.foreground },
                selectedStructure === 'triplet' && { color: theme.background }
              ]}>
                Triplet or Chipper
              </Text>
            </TouchableOpacity>
        </View>

        {generatedWorkout && (
          <View style={styles.workoutSection}>
            <Text style={[styles.sectionTitle, { color: theme.foreground }]}>Generated Workout</Text>
            <WorkoutDisplay
              workout={generatedWorkout}
              getModalityDescription={workoutGenerator.getModalityDescription.bind(workoutGenerator)}
              getModalityColor={workoutGenerator.getModalityColor.bind(workoutGenerator)}
              getTimeDomainDescription={workoutGenerator.getTimeDomainDescription.bind(workoutGenerator)}
              getTimeDomainColor={workoutGenerator.getTimeDomainColor.bind(workoutGenerator)}
              getWorkoutTypeDescription={workoutGenerator.getWorkoutTypeDescription.bind(workoutGenerator)}
              getWorkoutTypeColor={workoutGenerator.getWorkoutTypeColor.bind(workoutGenerator)}
              theme={theme}
              onCopyWorkout={handleCopyWorkoutPrompt}
            />
          </View>
        )}
      </ScrollView>

      {generatedWorkout && (
        <View style={[styles.bottomButtonContainer, { backgroundColor: theme.background, borderTopColor: theme.selection }]}>
          <TouchableOpacity
            style={[styles.clearButton, { backgroundColor: theme.comment }]}
            onPress={() => {
              setGeneratedWorkout(null);
              setSelectedStructure(null);
            }}
          >
            <Text style={[styles.clearButtonText, { color: theme.foreground }]}>Clear Workout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Legend Modal */}
      <LegendModal
        visible={showLegendModal}
        onClose={() => setShowLegendModal(false)}
      />



      {/* Theme Modal */}
      <Modal
        visible={showThemeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <TouchableOpacity 
          style={[styles.modalOverlay, { backgroundColor: `${theme.background}CC` }]} 
          activeOpacity={1} 
          onPress={() => setShowThemeModal(false)}
        >
          <TouchableOpacity 
            style={[styles.modalContent, { backgroundColor: theme.background, borderColor: theme.selection }]} 
            activeOpacity={1}
            onPress={() => {}} // Prevent closing when touching content
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.foreground }]}>Choose Theme</Text>
              <TouchableOpacity
                style={[styles.closeModalButton, { backgroundColor: theme.red }]}
                onPress={() => setShowThemeModal(false)}
              >
                <Text style={[styles.closeModalButtonText, { color: theme.foreground }]}>×</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.themeContainer}>
              <TouchableOpacity
                style={[
                  styles.themeOption, 
                  { backgroundColor: theme.selection, borderColor: theme.comment },
                  currentTheme === 'dracula' && { backgroundColor: theme.purple, borderColor: theme.purple }
                ]}
                onPress={() => setCurrentTheme('dracula')}
              >
                <Text style={[
                  styles.themeOptionText, 
                  { color: theme.foreground },
                  currentTheme === 'dracula' && { color: theme.background }
                ]}>Dracula</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.themeOption, 
                  { backgroundColor: theme.selection, borderColor: theme.comment },
                  currentTheme === 'catppuccin-latte' && { backgroundColor: theme.purple, borderColor: theme.purple }
                ]}
                onPress={() => setCurrentTheme('catppuccin-latte')}
              >
                <Text style={[
                  styles.themeOptionText, 
                  { color: theme.foreground },
                  currentTheme === 'catppuccin-latte' && { color: theme.background }
                ]}>Catppuccin Latte</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.themeOption, 
                  { backgroundColor: theme.selection, borderColor: theme.comment },
                  currentTheme === 'catppuccin-frappe' && { backgroundColor: theme.purple, borderColor: theme.purple }
                ]}
                onPress={() => setCurrentTheme('catppuccin-frappe')}
              >
                <Text style={[
                  styles.themeOptionText, 
                  { color: theme.foreground },
                  currentTheme === 'catppuccin-frappe' && { color: theme.background }
                ]}>Catppuccin Frappe</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.themeOption, 
                  { backgroundColor: theme.selection, borderColor: theme.comment },
                  currentTheme === 'catppuccin-macchiato' && { backgroundColor: theme.purple, borderColor: theme.purple }
                ]}
                onPress={() => setCurrentTheme('catppuccin-macchiato')}
              >
                <Text style={[
                  styles.themeOptionText, 
                  { color: theme.foreground },
                  currentTheme === 'catppuccin-macchiato' && { color: theme.background }
                ]}>Catppuccin Macchiato</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.themeOption, 
                  { backgroundColor: theme.selection, borderColor: theme.comment },
                  currentTheme === 'nord' && { backgroundColor: theme.purple, borderColor: theme.purple }
                ]}
                onPress={() => setCurrentTheme('nord')}
              >
                <Text style={[
                  styles.themeOptionText, 
                  { color: theme.foreground },
                  currentTheme === 'nord' && { color: theme.background }
                ]}>Nord</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Hamburger Menu Modal */}
      <Modal
        visible={showMenuModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenuModal(false)}
      >
        <TouchableOpacity 
          style={[styles.menuOverlay, { backgroundColor: `${theme.background}CC` }]} 
          activeOpacity={1} 
          onPress={() => setShowMenuModal(false)}
        >
          <TouchableOpacity 
            style={[styles.menuContent, { backgroundColor: theme.background, borderRightColor: theme.selection }]} 
            activeOpacity={1}
            onPress={() => {}} // Prevent closing when touching content
          >
            <View style={[styles.menuHeader, { borderBottomColor: theme.selection }]}>
              <Text style={[styles.menuTitle, { color: theme.foreground }]}>Menu</Text>
              <TouchableOpacity
                style={[styles.closeMenuButton, { backgroundColor: theme.red }]}
                onPress={() => setShowMenuModal(false)}
              >
                <Text style={[styles.closeMenuButtonText, { color: theme.foreground }]}>×</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomColor: theme.selection }]}
              onPress={() => {
                setShowMenuModal(false);
                navigation.navigate('HowToUse', { theme });
              }}
            >
              <Text style={styles.menuItemIcon}>📖</Text>
              <Text style={[styles.menuItemText, { color: theme.foreground }]}>How To Use</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomColor: theme.selection }]}
              onPress={() => {
                setShowMenuModal(false);
                setShowLegendModal(true);
              }}
            >
              <Text style={styles.menuItemIcon}>ℹ️</Text>
              <Text style={[styles.menuItemText, { color: theme.foreground }]}>Legend</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomColor: theme.selection }]}
              onPress={() => {
                setShowMenuModal(false);
                setShowThemeModal(true);
              }}
            >
              <Text style={styles.menuItemIcon}>🎨</Text>
              <Text style={[styles.menuItemText, { color: theme.foreground }]}>Theme</Text>
            </TouchableOpacity>

            {showInstallButton && (
              <TouchableOpacity
                style={[styles.menuItem, { borderBottomColor: theme.selection }]}
                onPress={handleInstallApp}
              >
                <Text style={styles.menuItemIcon}>⬇️</Text>
                <Text style={[styles.menuItemText, { color: theme.foreground }]}>
                  {Platform.OS === 'web' && /iPad|iPhone|iPod/.test(navigator.userAgent) 
                    ? 'Add to Home Screen' 
                    : 'Install App'}
                </Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuContent: {
    width: 250,
    height: '100%',
    borderRightWidth: 1,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeMenuButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeMenuButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    margin: 20,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeModalButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeModalButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalScrollView: {
    maxHeight: 350,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  howToSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  howToText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  howToBold: {
    fontWeight: 'bold',
  },
  exampleWorkout: {
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
  themeContainer: {
    gap: 12,
  },
  themeOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  themeOptionActive: {
    // This style is no longer needed as we use dynamic colors
  },
  themeOptionText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80, // Add padding to account for bottom button
  },
  structureSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  structureButton: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedButton: {
    // This style is no longer needed as we use dynamic colors
  },
  structureButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  selectedButtonText: {
    // This style is no longer needed as we use dynamic colors
  },
  structureDescription: {
    fontSize: 14,
  },
  workoutSection: {
    marginBottom: 30,
    marginTop: 20,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
  },
  clearButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
