import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";

const { width, height } = Dimensions.get("window");

export default function InitializingScreen() {
  const insets = useSafeAreaInsets();
  const { completeLogin } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Animation values
  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const ripple1Scale = useSharedValue(0);
  const ripple2Scale = useSharedValue(0);
  const ripple3Scale = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const dotScale1 = useSharedValue(0);
  const dotScale2 = useSharedValue(0);
  const dotScale3 = useSharedValue(0);

  const steps = [
    "Connecting to KPM Partner Network...",
    "Verifying your credentials...",
    "Setting up your shop dashboard...",
    "Loading your business data...",
    "Initializing order management...",
    "Almost ready! Finalizing setup..."
  ];

  useEffect(() => {
    startInitializationSequence();
  }, []);

  const startInitializationSequence = () => {
    // Logo entrance animation with bounce
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    
    // Subtle rotation
    logoRotate.value = withSequence(
      withTiming(5, { duration: 300 }),
      withTiming(-5, { duration: 300 }),
      withTiming(0, { duration: 300 })
    );

    // Pulse animation
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Ripple effects
    setTimeout(() => {
      ripple1Scale.value = withRepeat(
        withTiming(4, { duration: 3000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
    }, 500);

    setTimeout(() => {
      ripple2Scale.value = withRepeat(
        withTiming(4, { duration: 3000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
    }, 1500);

    setTimeout(() => {
      ripple3Scale.value = withRepeat(
        withTiming(4, { duration: 3000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
    }, 2500);

    // Loading dots animation
    dotScale1.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.5, { duration: 400 })
        ),
        -1,
        true
      )
    );
    
    dotScale2.value = withDelay(
      1200,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.5, { duration: 400 })
        ),
        -1,
        true
      )
    );
    
    dotScale3.value = withDelay(
      1400,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.5, { duration: 400 })
        ),
        -1,
        true
      )
    );

    // Progress bar and step progression
    simulateInitialization();
  };

  const simulateInitialization = async () => {
    for (let i = 0; i < steps.length; i++) {
      runOnJS(setCurrentStep)(i);
      
      // Animate progress bar
      progressWidth.value = withTiming(
        ((i + 1) / steps.length) * 100,
        { duration: 800, easing: Easing.out(Easing.ease) }
      );

      // Wait for each step
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Final completion animation
    logoRotate.value = withSequence(
      withTiming(360, { duration: 1000 }),
      withTiming(0, { duration: 0 })
    );

    // Complete login - auth state change will trigger automatic navigation
    setTimeout(async () => {
      try {
        await completeLogin();
        // RootNavigator will automatically redirect to dashboard when auth state changes
      } catch (error) {
        console.error("Login completion failed:", error);
      }
    }, 1000);
  };

  // Animated styles
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
      opacity: interpolate(
        rippleScale.value,
        [0, 2, 4],
        [0, 0.4, 0]
      ),
    }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const dotAnimatedStyle = (scale: any) => 
    useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: scale.value,
    }));

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={["#fff7ed", "#ffffff", "#fff7ed"]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View 
          className="flex-1 items-center justify-center relative overflow-hidden"
          style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
        >
          {/* Creative Background Elements - matching other screens */}
          <View className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-orange-400/20 to-amber-300/10 rounded-full" />
          <View className="absolute top-32 -left-16 w-32 h-32 bg-gradient-to-tr from-orange-300/15 to-yellow-200/5 rounded-full" />
          <View className="absolute bottom-20 right-8 w-24 h-24 bg-gradient-to-bl from-orange-200/25 to-orange-100/10 rounded-full" />
          
          {/* Geometric shapes */}
          <View className="absolute top-24 left-8 w-6 h-6 bg-orange-400/20 rotate-45 rounded-sm" />
          <View className="absolute top-40 right-12 w-4 h-4 bg-amber-300/30 rotate-12 rounded-sm" />
          <View className="absolute bottom-32 left-12 w-5 h-5 bg-orange-300/25 -rotate-12 rounded-sm" />
          
          {/* Floating dots pattern */}
          <View className="absolute top-16 left-1/4">
            <View className="w-2 h-2 bg-orange-400/40 rounded-full mb-4" />
            <View className="w-1.5 h-1.5 bg-orange-300/30 rounded-full ml-3 mb-3" />
            <View className="w-1 h-1 bg-orange-200/40 rounded-full ml-1" />
          </View>
          
          <View className="absolute bottom-24 right-1/4">
            <View className="w-1 h-1 bg-amber-400/50 rounded-full mb-3" />
            <View className="w-2 h-2 bg-orange-300/35 rounded-full ml-2 mb-2" />
            <View className="w-1.5 h-1.5 bg-orange-200/45 rounded-full" />
          </View>

          {/* Ripple Effects */}
          <Animated.View
            style={[
              {
                position: "absolute",
                width: 200,
                height: 200,
                borderRadius: 100,
                borderWidth: 3,
                borderColor: "#f97316",
              },
              rippleAnimatedStyle(ripple1Scale),
            ]}
          />
          <Animated.View
            style={[
              {
                position: "absolute",
                width: 200,
                height: 200,
                borderRadius: 100,
                borderWidth: 3,
                borderColor: "#fb923c",
              },
              rippleAnimatedStyle(ripple2Scale),
            ]}
          />
          <Animated.View
            style={[
              {
                position: "absolute",
                width: 200,
                height: 200,
                borderRadius: 100,
                borderWidth: 3,
                borderColor: "#fed7aa",
              },
              rippleAnimatedStyle(ripple3Scale),
            ]}
          />

          {/* Main Content */}
          <View className="items-center px-8">
            {/* Logo with shadow - matching splash screen */}
            <Animated.View 
              style={[
                logoAnimatedStyle, 
                { 
                  zIndex: 20,
                  shadowColor: "#f97316",
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.3,
                  shadowRadius: 20,
                  elevation: 15,
                  marginBottom: 40,
                }
              ]}
            >
              <Image
                source={require("../../assets/images/logo.png")}
                style={{
                  width: width * 0.4,
                  height: width * 0.4,
                }}
                resizeMode="contain"
              />
            </Animated.View>

            {/* Brand Text - matching splash screen */}
            <Animated.View 
              entering={FadeInUp.delay(800).duration(800)}
              className="items-center mb-12"
            >
              <Text className="text-orange-600 text-2xl font-bold tracking-wider text-center">
                KPM Partner
              </Text>
              <Text className="text-orange-400 text-sm font-medium tracking-widest text-center mt-1">
                FOR BUSINESS
              </Text>
            </Animated.View>

            {/* Progress Section */}
            <Animated.View 
              entering={FadeIn.delay(1200).duration(800)}
              className="w-full"
            >
              {/* Progress Bar - matching app theme */}
              <View className="bg-orange-100 h-3 rounded-full mb-6 overflow-hidden">
                <Animated.View
                  style={[
                    progressAnimatedStyle,
                    {
                      height: '100%',
                      borderRadius: 6,
                    }
                  ]}
                >
                  <LinearGradient
                    colors={["#f97316", "#fb923c"]}
                    style={{ flex: 1, borderRadius: 6 }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </Animated.View>
              </View>

              {/* Step Text */}
              <Animated.View entering={FadeInUp.delay(1500).duration(600)}>
                <Text className="text-gray-800 text-center text-lg font-semibold mb-2">
                  {steps[currentStep]}
                </Text>
                <Text className="text-orange-500 text-center text-sm font-medium">
                  Step {currentStep + 1} of {steps.length}
                </Text>
              </Animated.View>
            </Animated.View>

            {/* Loading dots - matching splash screen style */}
            <View className="flex-row mt-12 space-x-2">
              <Animated.View
                style={[
                  dotAnimatedStyle(dotScale1),
                  {
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#f97316",
                  },
                ]}
              />
              <Animated.View
                style={[
                  dotAnimatedStyle(dotScale2),
                  {
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#fb923c",
                    marginLeft: 8,
                  },
                ]}
              />
              <Animated.View
                style={[
                  dotAnimatedStyle(dotScale3),
                  {
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#fdba74",
                    marginLeft: 8,
                  },
                ]}
              />
            </View>
          </View>

          {/* Bottom Message */}
          <Animated.View 
            entering={FadeInUp.delay(2000).duration(800)}
            className="absolute bottom-20 px-8"
          >
            <Text className="text-center text-gray-600 text-sm leading-5">
              Setting up your business dashboard...{'\n'}
              This may take a few moments
            </Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </>
  );
}