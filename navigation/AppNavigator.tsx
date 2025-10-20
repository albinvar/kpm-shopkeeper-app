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
  const [animatingScreen, setAnimatingScreen] = useState<ScreenType | null>(null);
  const translateX = useSharedValue(width);

  // Get current screen from top of stack
  const currentScreen = navigationStack.length > 0 ? navigationStack[navigationStack.length - 1] : null;

  const navigateTo = (screen: ScreenType) => {
    if (isTransitioning || currentScreen === screen || !screen) return;

    console.log('AppNavigator navigateTo:', screen, 'current stack:', navigationStack);

    setIsTransitioning(true);
    setAnimatingScreen(screen);

    // Reset translateX to start off-screen
    translateX.value = width;

    // Add new screen to stack
    setNavigationStack(prev => [...prev, screen]);

    // Animate the new screen in
    requestAnimationFrame(() => {
      translateX.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(setAnimatingScreen)(null);
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

    const screenToAnimate = navigationStack[navigationStack.length - 1];
    setIsTransitioning(true);
    setAnimatingScreen(screenToAnimate);

    // Animate out the current screen
    translateX.value = withTiming(width, { duration: 300 }, () => {
      // Remove the screen from stack after animation
      const newStack = navigationStack.slice(0, -1);
      runOnJS(updateNavigationStack)(newStack);
      runOnJS(setAnimatingScreen)(null);
      runOnJS(setIsTransitioning)(false);
    });
  };

  const screenStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const renderScreen = (screen: ScreenType) => {
    switch (screen) {
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

      {/* Render all screens in the stack, but only animate the top one */}
      {navigationStack.map((screen, index) => {
        const isTopScreen = index === navigationStack.length - 1;
        const isAnimating = animatingScreen === screen;

        return (
          <Animated.View
            key={`${screen}_${index}`}
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                width: width,
                height: '100%',
                backgroundColor: '#ffffff',
                zIndex: 10 + index,
              },
              // Only apply animation to the screen that's currently animating
              isAnimating && isTopScreen ? screenStyle : { transform: [{ translateX: 0 }] }
            ]}
          >
            {renderScreen(screen)}
          </Animated.View>
        );
      })}
    </View>
  );
}
