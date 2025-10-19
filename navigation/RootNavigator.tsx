// navigation/RootNavigator.tsx
import { useEffect, useState, useRef } from "react";
import { ActivityIndicator, View, Dimensions, Image, Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";
import OnboardingNavigator from "./OnboardingNavigator";
import { useGlobalBackConfirmation } from "../hooks/useGlobalBackConfirmation";
import { useAuth } from "../contexts/AuthContext";

const { width, height } = Dimensions.get("window");

export default function RootNavigator() {
  const [loading, setLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [showSplashAfterLogin, setShowSplashAfterLogin] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const wasAuthenticatedRef = useRef(isAuthenticated);

  // Enable global back confirmation when user is authenticated and using main app
  useGlobalBackConfirmation({
    enabled: isAuthenticated && hasSeenOnboarding && !loading,
  });

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  // Detect when user just logged in (auth changed from false to true)
  useEffect(() => {
    if (!wasAuthenticatedRef.current && isAuthenticated && !authLoading) {
      // User just logged in, show splash screen
      setShowSplashAfterLogin(true);

      // Hide splash after 2 seconds
      setTimeout(() => {
        setShowSplashAfterLogin(false);
      }, 2000);
    }

    wasAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated, authLoading]);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingSeen = await AsyncStorage.getItem('hasSeenOnboarding');
      setHasSeenOnboarding(onboardingSeen === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setHasSeenOnboarding(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (!hasSeenOnboarding) {
    return <OnboardingNavigator />;
  }

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  // Show splash screen briefly after login
  if (showSplashAfterLogin) {
    return <PostLoginSplash />;
  }

  return <AppNavigator />;
}

// Splash screen component shown after successful login
function PostLoginSplash() {
  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const ripple1Scale = useSharedValue(0);
  const ripple2Scale = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const dotScale1 = useSharedValue(0);
  const dotScale2 = useSharedValue(0);
  const dotScale3 = useSharedValue(0);

  const logoSize = Math.min(width, height) * 0.5;
  const rippleSize = Math.min(width, height) * 0.6;

  useEffect(() => {
    // Quick entrance animations
    logoOpacity.value = withTiming(1, { duration: 300 });
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });

    logoRotate.value = withSequence(
      withTiming(5, { duration: 200 }),
      withTiming(-5, { duration: 200 }),
      withTiming(0, { duration: 200 })
    );

    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      2,
      false
    );

    ripple1Scale.value = withTiming(3.5, { duration: 2000, easing: Easing.out(Easing.ease) });
    ripple2Scale.value = withDelay(300, withTiming(3.5, { duration: 2000, easing: Easing.out(Easing.ease) }));

    dotScale1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0.5, { duration: 300 })
      ),
      -1,
      true
    );

    dotScale2.value = withDelay(
      200,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.5, { duration: 300 })
        ),
        -1,
        true
      )
    );

    dotScale3.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.5, { duration: 300 })
        ),
        -1,
        true
      )
    );

    textOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value * pulseScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
    opacity: logoOpacity.value,
  }));

  const rippleAnimatedStyle = (rippleScale: any) =>
    useAnimatedStyle(() => ({
      transform: [{ scale: rippleScale.value }],
      opacity: interpolate(rippleScale.value, [0, 0.5, 3], [0, 0.3, 0]),
    }));

  const dotAnimatedStyle = (scale: any) =>
    useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: scale.value,
    }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: interpolate(textOpacity.value, [0, 1], [20, 0]) }],
  }));

  return (
    <View className="flex-1 items-center justify-center bg-gradient-to-br from-orange-50 to-white relative overflow-hidden">
      <View className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50 opacity-50" />

      <View className="absolute -top-20 -left-20 w-40 h-40 bg-orange-100 rounded-full opacity-20" />
      <View className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-100 rounded-full opacity-20" />

      <Animated.View
        style={[
          {
            position: "absolute",
            width: rippleSize,
            height: rippleSize,
            borderRadius: rippleSize / 2,
            borderWidth: 2,
            borderColor: "#f97316",
          },
          rippleAnimatedStyle(ripple1Scale),
        ]}
      />
      <Animated.View
        style={[
          {
            position: "absolute",
            width: rippleSize,
            height: rippleSize,
            borderRadius: rippleSize / 2,
            borderWidth: 2,
            borderColor: "#fb923c",
          },
          rippleAnimatedStyle(ripple2Scale),
        ]}
      />

      <Animated.View
        style={[
          logoAnimatedStyle,
          {
            zIndex: 20,
            shadowColor: "#f97316",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 10,
          }
        ]}
      >
        <Image
          source={require("../assets/images/logo.png")}
          style={{ width: logoSize, height: logoSize }}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View style={[textAnimatedStyle, { position: "absolute", bottom: height * 0.15 }]}>
        <Text className="text-orange-600 text-2xl font-bold tracking-wider text-center">
          KPM Partner
        </Text>
        <Text className="text-orange-400 text-sm font-medium tracking-widest text-center mt-1">
          FOR BUSINESS
        </Text>
      </Animated.View>

      <View className="absolute bottom-20 flex-row space-x-2">
        <Animated.View
          style={[
            dotAnimatedStyle(dotScale1),
            { width: 8, height: 8, borderRadius: 4, backgroundColor: "#f97316" },
          ]}
        />
        <Animated.View
          style={[
            dotAnimatedStyle(dotScale2),
            { width: 8, height: 8, borderRadius: 4, backgroundColor: "#fb923c", marginLeft: 8 },
          ]}
        />
        <Animated.View
          style={[
            dotAnimatedStyle(dotScale3),
            { width: 8, height: 8, borderRadius: 4, backgroundColor: "#fdba74", marginLeft: 8 },
          ]}
        />
      </View>
    </View>
  );
}
