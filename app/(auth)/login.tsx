import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import Animated, {
  FadeInUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LogoSvg from "../../assets/onboarding/hero.svg";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValidPhone, setIsValidPhone] = useState(false);

  const formatPhoneNumber = (text: string) => {
    // Remove all non-numeric characters
    const numeric = text.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limited = numeric.slice(0, 10);
    
    // Format as groups: 98765 43210
    let formatted = limited;
    if (limited.length > 5) {
      formatted = `${limited.slice(0, 5)} ${limited.slice(5)}`;
    }
    
    return formatted;
  };

  const validatePhoneNumber = (phone: string) => {
    const numeric = phone.replace(/\D/g, '');
    return numeric.length === 10 && /^[6-9]/.test(numeric);
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
    setIsValidPhone(validatePhoneNumber(formatted));
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={["#fff7ed", "#ffffff", "#fff7ed"]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <View className="flex-1">
            {/* Creative Top Section with Dynamic Background */}
            <View 
              className="items-center justify-center px-4 relative overflow-hidden flex-1"
              style={{ 
                paddingTop: insets.top + 10,
                minHeight: Platform.OS === "ios" ? 300 : 280
              }}
            >
            {/* Creative Background Elements */}
            {/* Large gradient circles */}
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
            
            {/* Curved lines/waves */}
            <View className="absolute top-20 left-0 w-full h-1">
              <View className="w-20 h-px bg-gradient-to-r from-transparent via-orange-300/30 to-transparent ml-8" />
            </View>
            <View className="absolute bottom-40 right-0 w-full h-1">
              <View className="w-16 h-px bg-gradient-to-l from-transparent via-amber-300/25 to-transparent mr-12" />
            </View>
            
            {/* Layered background texture */}
            <View className="absolute inset-0 bg-gradient-to-b from-orange-50/30 via-transparent to-transparent" />
            <View className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-50/20 to-orange-50/30" />
            
            {/* Main content with subtle backdrop */}
            <View className="items-center relative z-10">
              <View className="relative">
                {/* Logo backdrop circle */}
                <View className="absolute -inset-6 bg-white/60 rounded-full blur-lg" />
                <LogoSvg width={width * 0.55} height={width * 0.55} />
              </View>
              
              <View className="items-center mt-6">
                <Text className="text-3xl font-bold text-gray-900 mb-2 drop-shadow-sm">
                  Welcome Back
                </Text>
                <Text className="text-gray-700 text-center text-base drop-shadow-sm">
                  Sign in to your KPM Partner account to continue
                </Text>
              </View>
            </View>
            </View>

            {/* Rising Bottom Section with Rounded Corners - Anchored to bottom */}
            <Animated.View 
              entering={FadeInUp.delay(300).springify()}
              className="bg-white shadow-xl rounded-t-[48px] px-6 pt-8 pb-8"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -8 },
                shadowOpacity: 0.12,
                shadowRadius: 20,
                elevation: 25,
              }}
            >
          {/* Handle bar */}
          <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-8" />
          
          {/* Header Section */}
          <View className="mb-8 px-2">
            <Text className="text-3xl font-bold mb-4">
              <Text className="text-gray-900">Let&apos;s get you </Text>
              <Text className="text-orange-500">signed in</Text>
            </Text>
            <Text className="text-gray-600 text-base">
              Enter your phone number to continue
            </Text>
          </View>

          {/* Phone Input Section */}
          <View className="mb-5">
            <View className={`flex-row items-center px-4 py-3 bg-gray-50 border-2 rounded-2xl transition-colors ${
              phoneNumber ? (isValidPhone ? 'border-green-400' : 'border-red-400') : 'border-gray-200'
            }`}>
              <View className="flex-row items-center">
                <Text className="text-gray-700 font-semibold mr-2">🇮🇳 +91</Text>
                <View className="w-px h-5 bg-gray-300 mr-3" />
              </View>
              <Ionicons 
                name="call-outline" 
                size={20} 
                color={phoneNumber ? (isValidPhone ? "#10b981" : "#ef4444") : "#f97316"} 
              />
              <TextInput
                placeholder="98765 43210"
                keyboardType="phone-pad"
                className="flex-1 ml-3 text-base text-gray-900 font-semibold"
                placeholderTextColor="#9CA3AF"
                autoFocus={false}
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                maxLength={11} // Account for space formatting
              />
              {phoneNumber && (
                <View className="ml-2">
                  {isValidPhone ? (
                    <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                  ) : (
                    <Ionicons name="close-circle" size={20} color="#ef4444" />
                  )}
                </View>
              )}
            </View>
            {phoneNumber && !isValidPhone && (
              <Text className="text-red-500 text-xs mt-2 ml-2">
                Please enter a valid 10-digit Indian mobile number
              </Text>
            )}
          </View>

          {/* Get Started Button */}
          <TouchableOpacity
            onPress={() => {
              if (isValidPhone) {
                router.push("/(auth)/otp");
              }
            }}
            activeOpacity={0.85}
            className="mb-12"
            disabled={!isValidPhone}
            style={{
              shadowColor: "#f97316",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: isValidPhone ? 0.25 : 0.1,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <LinearGradient
              colors={isValidPhone ? ["#f97316", "#fb923c"] : ["#d1d5db", "#9ca3af"]}
              style={{ 
                paddingVertical: 18, 
                paddingHorizontal: 32,
                borderRadius: 16,
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View className="flex-row items-center justify-center">
                <Text className={`text-lg font-bold mr-2 ${isValidPhone ? 'text-white' : 'text-gray-400'}`}>
                  Get Started
                </Text>
                <Text className={`text-lg ${isValidPhone ? 'text-white' : 'text-gray-400'}`}>→</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Terms */}
          <View className="items-center">
            <View className="px-4">
              <Text className="text-xs text-center text-gray-500 leading-4">
                By continuing, you agree to our{" "}
                <Text className="text-orange-500 font-medium">Terms of Service</Text> and{" "}
                <Text className="text-orange-500 font-medium">Privacy Policy</Text>
              </Text>
            </View>
            </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}
