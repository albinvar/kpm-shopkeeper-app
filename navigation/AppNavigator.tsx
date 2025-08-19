import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS 
} from 'react-native-reanimated';
import DashboardScreen from '../app/(tabs)/index';
import SettingsScreen from '../app/(tabs)/profile';

const { width } = Dimensions.get('window');

export default function AppNavigator() {
  const [showSettings, setShowSettings] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const translateX = useSharedValue(width); // Start settings off-screen to the right

  const navigateToSettings = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setShowSettings(true);
    
    // Slide settings in from right
    translateX.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(setIsTransitioning)(false);
    });
  };

  const navigateBack = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Slide settings out to the right
    translateX.value = withTiming(width, { duration: 300 }, () => {
      runOnJS(setShowSettings)(false);
      runOnJS(setIsTransitioning)(false);
    });
  };

  const settingsStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={{ flex: 1 }}>
      {/* Dashboard Screen - Always visible */}
      <DashboardScreen onNavigateToSettings={navigateToSettings} />

      {/* Settings Screen - Slides in over dashboard */}
      {showSettings && (
        <Animated.View 
          style={[
            { 
              position: 'absolute', 
              top: 0,
              left: 0,
              width: width, 
              height: '100%',
              backgroundColor: '#ffffff',
              zIndex: 10,
            }, 
            settingsStyle
          ]}
        >
          <SettingsScreen onBack={navigateBack} />
        </Animated.View>
      )}
    </View>
  );
}
