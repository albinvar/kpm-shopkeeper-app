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
import ShopProfileScreen from '../app/shop-profile';
import ContactInfoScreen from '../app/contact-info';
import OperatingHoursScreen from '../app/operating-hours';

const { width } = Dimensions.get('window');

type ScreenType = 'settings' | 'shop-profile' | 'contact-info' | 'operating-hours' | null;

export default function AppNavigator() {
  const [navigationStack, setNavigationStack] = useState<ScreenType[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const translateX = useSharedValue(width);

  // Get current screen from top of stack
  const currentScreen = navigationStack.length > 0 ? navigationStack[navigationStack.length - 1] : null;

  const navigateTo = (screen: ScreenType) => {
    if (isTransitioning || currentScreen === screen || !screen) return;

    console.log('AppNavigator navigateTo:', screen, 'current stack:', navigationStack);

    setIsTransitioning(true);

    // If there's already a screen showing, we need to prepare for the new screen
    if (currentScreen) {
      // Instantly reset translateX to start off-screen for the new screen
      translateX.value = width;
    }

    setNavigationStack(prev => [...prev, screen]);

    // Small delay to allow React to update the screen content
    requestAnimationFrame(() => {
      translateX.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(setIsTransitioning)(false);
      });
    });
  };

  // Helper function to update navigation stack (needed for runOnJS)
  const updateNavigationStack = (newStack: ScreenType[]) => {
    console.log('updateNavigationStack called with:', newStack);
    setNavigationStack(newStack);
  };

  const navigateBack = () => {
    if (isTransitioning || navigationStack.length === 0) return;

    console.log('AppNavigator navigateBack, current stack:', navigationStack);

    const willHaveRemainingScreen = navigationStack.length > 1;
    // Calculate new stack BEFORE animation to avoid closure issues with runOnJS
    const newStack = navigationStack.slice(0, -1);

    setIsTransitioning(true);

    translateX.value = withTiming(width, { duration: 300 }, () => {
      runOnJS(updateNavigationStack)(newStack);
      runOnJS(setIsTransitioning)(false);
      // After popping, if there's still a screen in the stack, ensure it's positioned at 0
      if (willHaveRemainingScreen) {
        translateX.value = 0;
      }
    });
  };

  const screenStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'settings':
        return <SettingsScreen onBack={navigateBack} onNavigate={navigateTo} />;
      case 'shop-profile':
        return <ShopProfileScreen onClose={navigateBack} />;
      case 'contact-info':
        return <ContactInfoScreen onClose={navigateBack} />;
      case 'operating-hours':
        return <OperatingHoursScreen onClose={navigateBack} />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DashboardScreen onNavigateToSettings={() => navigateTo('settings')} />

      {currentScreen && (
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
            screenStyle
          ]}
        >
          {renderCurrentScreen()}
        </Animated.View>
      )}
    </View>
  );
}
