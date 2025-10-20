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
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const translateX = useSharedValue(width);

  const navigateTo = (screen: ScreenType) => {
    if (isTransitioning || currentScreen === screen) return;

    setIsTransitioning(true);
    setCurrentScreen(screen);

    translateX.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(setIsTransitioning)(false);
    });
  };

  const navigateBack = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    translateX.value = withTiming(width, { duration: 300 }, () => {
      runOnJS(setCurrentScreen)(null);
      runOnJS(setIsTransitioning)(false);
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
        return <ShopProfileScreen />;
      case 'contact-info':
        return <ContactInfoScreen />;
      case 'operating-hours':
        return <OperatingHoursScreen />;
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
