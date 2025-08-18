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
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Animation values
  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const ripple1Scale = useSharedValue(0);
  const ripple2Scale = useSharedValue(0);
  const ripple3Scale = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const particleOpacity = useSharedValue(0);
  const glowIntensity = useSharedValue(0);

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
    // Logo entrance animation
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    
    // Glow effect
    glowIntensity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.3, { duration: 1500 })
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

    // Particle effects
    particleOpacity.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0, { duration: 800 })
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
      await new Promise(resolve => setTimeout(resolve, 1200));
    }

    // Final completion animation
    logoRotate.value = withSequence(
      withTiming(360, { duration: 800 }),
      withTiming(0, { duration: 0 })
    );

    // Complete login and navigate
    setTimeout(async () => {
      try {
        await login();
        router.replace("/(tabs)");
      } catch (error) {
        console.error("Login failed:", error);
      }
    }, 1000);
  };

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
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
        [0, 0.6, 0]
      ),
    }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const particleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: particleOpacity.value,
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowIntensity.value,
  }));

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View 
          className="flex-1 items-center justify-center relative"
          style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
        >
          {/* Animated Background Particles */}
          <Animated.View 
            style={[particleAnimatedStyle, { position: 'absolute', top: 100, left: 50 }]}
          >
            <View className="w-2 h-2 bg-orange-400 rounded-full" />
          </Animated.View>
          <Animated.View 
            style={[particleAnimatedStyle, { position: 'absolute', top: 200, right: 80 }]}
          >
            <View className="w-1 h-1 bg-amber-300 rounded-full" />
          </Animated.View>
          <Animated.View 
            style={[particleAnimatedStyle, { position: 'absolute', bottom: 300, left: 100 }]}
          >
            <View className="w-1.5 h-1.5 bg-orange-300 rounded-full" />
          </Animated.View>

          {/* Ripple Effects */}
          <Animated.View
            style={[
              {
                position: "absolute",
                width: 200,
                height: 200,
                borderRadius: 100,
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
                width: 200,
                height: 200,
                borderRadius: 100,
                borderWidth: 2,
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
                borderWidth: 2,
                borderColor: "#fed7aa",
              },
              rippleAnimatedStyle(ripple3Scale),
            ]}
          />

          {/* Main Content */}
          <View className="items-center">
            {/* Logo with Glow Effect */}
            <View className="relative mb-12">
              <Animated.View
                style={[
                  glowAnimatedStyle,
                  {
                    position: "absolute",
                    width: 200,
                    height: 200,
                    borderRadius: 100,
                    backgroundColor: "#f97316",
                    opacity: 0.3,
                    top: -20,
                    left: -20,
                  },
                ]}
              />
              <Animated.View style={logoAnimatedStyle}>
                <Image
                  source={require("../../assets/images/logo.png")}
                  style={{
                    width: 160,
                    height: 160,
                  }}
                  resizeMode="contain"
                />
              </Animated.View>
            </View>

            {/* Brand Text */}
            <Animated.View 
              entering={FadeInUp.delay(1000).duration(800)}
              className="items-center mb-16"
            >
              <Text className="text-white text-3xl font-bold mb-2">
                KPM Partner
              </Text>
              <Text className="text-orange-200 text-lg font-medium tracking-wider">
                FOR BUSINESS
              </Text>
            </Animated.View>

            {/* Progress Section */}
            <Animated.View 
              entering={FadeIn.delay(1500).duration(800)}
              className="w-full px-8"
            >
              {/* Progress Bar */}
              <View className="bg-gray-700 h-2 rounded-full mb-6 overflow-hidden">
                <Animated.View
                  style={[
                    progressAnimatedStyle,
                    {
                      height: '100%',
                      backgroundColor: '#f97316',
                      borderRadius: 4,
                    }
                  ]}
                />
              </View>

              {/* Step Text */}
              <Animated.View entering={FadeInUp.delay(2000).duration(600)}>
                <Text className="text-white text-center text-lg font-medium mb-2">
                  {steps[currentStep]}
                </Text>
                <Text className="text-orange-200 text-center text-sm">
                  Step {currentStep + 1} of {steps.length}
                </Text>
              </Animated.View>
            </Animated.View>

            {/* Loading Dots */}
            <Animated.View 
              entering={FadeIn.delay(2500).duration(800)}
              className="flex-row mt-12 space-x-2"
            >
              {[...Array(3)].map((_, index) => (
                <Animated.View
                  key={index}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#f97316',
                  }}
                  entering={FadeIn.delay(2500 + index * 200).duration(400)}
                />
              ))}
            </Animated.View>
          </View>

          {/* Bottom Message */}
          <Animated.View 
            entering={FadeInUp.delay(3000).duration(800)}
            className="absolute bottom-20 px-8"
          >
            <Text className="text-center text-gray-300 text-sm">
              Setting up your business dashboard...{'\n'}
              This may take a few moments
            </Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </>
  );
}