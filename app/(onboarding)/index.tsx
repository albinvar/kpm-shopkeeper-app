import { LinearGradient } from "expo-linear-gradient";
import { Stack, router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const logoScale = useSharedValue(0.9);
  const logoRotate = useSharedValue(0);
  const floatY = useSharedValue(0);
  const shimmerX = useSharedValue(-width);
  const bgScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.3);

  useEffect(() => {
    // Logo breathing effect
    logoScale.value = withRepeat(
      withTiming(1.05, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Floating animation
    floatY.value = withRepeat(
      withTiming(-15, {
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Subtle rotation
    logoRotate.value = withRepeat(
      withTiming(3, {
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Shimmer effect
    shimmerX.value = withRepeat(
      withTiming(width, {
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false
    );

    // Background pulse
    bgScale.value = withRepeat(
      withTiming(1.2, {
        duration: 5000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Pulse opacity
    pulseOpacity.value = withRepeat(
      withTiming(0.6, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { translateY: floatY.value },
      { rotate: `${logoRotate.value}deg` },
    ],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  const bgAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bgScale.value }],
    opacity: interpolate(bgScale.value, [1, 1.2], [0.3, 0.1]),
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [
      { scale: interpolate(pulseOpacity.value, [0.3, 0.6], [1, 1.3]) },
    ],
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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View
            className="flex-1 px-6"
            style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }}
          >
            {/* Animated background elements */}
            <Animated.View
              style={[
                bgAnimatedStyle,
                {
                  position: "absolute",
                  top: -100,
                  right: -100,
                  width: 300,
                  height: 300,
                  borderRadius: 150,
                  backgroundColor: "#fed7aa",
                },
              ]}
            />
            <Animated.View
              style={[
                bgAnimatedStyle,
                {
                  position: "absolute",
                  bottom: -50,
                  left: -50,
                  width: 200,
                  height: 200,
                  borderRadius: 100,
                  backgroundColor: "#ffedd5",
                },
              ]}
            />

            {/* Top decorative elements */}
            <View className="absolute top-10 right-5">
              <View className="w-3 h-3 bg-orange-400 rounded-full mb-2" />
              <View className="w-2 h-2 bg-orange-300 rounded-full mb-2" />
              <View className="w-1 h-1 bg-orange-200 rounded-full" />
            </View>

            {/* Main content */}
            <View className="flex-1 justify-center items-center">
              {/* Logo container with effects */}
              <View className="relative mb-6">
                {/* Pulse ring */}
                <Animated.View
                  style={[
                    pulseStyle,
                    {
                      position: "absolute",
                      width: width * 0.6,
                      height: width * 0.6,
                      borderRadius: width * 0.3,
                      borderWidth: 2,
                      borderColor: "#fb923c",
                      top: -width * 0.05,
                      left: -width * 0.05,
                    },
                  ]}
                />

                {/* Logo with shimmer */}
                <Animated.View style={logoAnimatedStyle}>
                  <View className="relative">
                    <Image
                      source={require("../../assets/images/logo.png")}
                      style={{
                        width: width * 0.5,
                        height: width * 0.5,
                      }}
                      resizeMode="contain"
                    />
                    
                    {/* Shimmer overlay */}
                    <Animated.View
                      style={[
                        shimmerStyle,
                        {
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: width * 0.5,
                          height: width * 0.5,
                          opacity: 0.3,
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={["transparent", "rgba(255, 255, 255, 0.5)", "transparent"]}
                        style={{ flex: 1 }}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      />
                    </Animated.View>
                  </View>
                </Animated.View>
              </View>

              {/* Spacer to push welcome text down */}
              <View style={{ height: 80 }} />

              {/* Welcome text with animation */}
              <Animated.View entering={FadeInUp.delay(300).springify()}>
                <Text className="text-4xl font-bold text-gray-800 text-center mb-3">
                  Welcome to{" "}
                  <Text className="text-orange-500">KPM Partner</Text>
                </Text>
                <Text className="text-base text-gray-600 text-center px-8 mb-8">
                  Manage your shop, track orders, and grow your business with our partner platform
                </Text>
              </Animated.View>

              {/* Feature highlights */}
              <Animated.View 
                entering={FadeInUp.delay(500).springify()}
                className="flex-row justify-center mb-12 px-4"
              >
                <View className="items-center mx-4">
                  <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mb-2">
                    <Text className="text-xl">📋</Text>
                  </View>
                  <Text className="text-xs text-gray-600">Orders</Text>
                </View>
                <View className="items-center mx-4">
                  <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mb-2">
                    <Text className="text-xl">💰</Text>
                  </View>
                  <Text className="text-xs text-gray-600">Finance</Text>
                </View>
                <View className="items-center mx-4">
                  <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mb-2">
                    <Text className="text-xl">🚚</Text>
                  </View>
                  <Text className="text-xs text-gray-600">Delivery</Text>
                </View>
              </Animated.View>
            </View>

            {/* Bottom section with buttons */}
            <Animated.View 
              entering={FadeInDown.delay(700).springify()}
              className="mb-4"
            >
              {/* Login button with gradient */}
              <TouchableOpacity
                onPress={async () => {
                  await AsyncStorage.setItem('hasSeenOnboarding', 'true');
                  router.replace("/(auth)/login");
                }}
                activeOpacity={0.9}
                className="mb-4 overflow-hidden rounded-2xl"
                style={{
                  shadowColor: "#f97316",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <LinearGradient
                  colors={["#f97316", "#fb923c"]}
                  style={{ paddingVertical: 18, paddingHorizontal: 32 }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View className="flex-row items-center justify-center">
                    <Text className="text-white text-lg font-bold mr-2">
                      Login to Your Shop
                    </Text>
                    <Text className="text-white text-lg">→</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Info text */}
              <View className="bg-orange-50 rounded-xl p-4 mb-4">
                <Text className="text-orange-800 text-sm text-center font-medium">
                  📱 Partner Registration
                </Text>
                <Text className="text-orange-600 text-xs text-center mt-1">
                  New partners must register through our web portal or contact support
                </Text>
              </View>

              {/* Terms text */}
              <Text className="text-xs text-gray-400 text-center mt-2">
                By continuing, you agree to our Terms & Privacy Policy
              </Text>
            </Animated.View>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
}