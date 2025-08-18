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
  StatusBar,
} from "react-native";
import Animated, {
  FadeInUp,
  FadeInDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LogoSvg from "../../assets/onboarding/hero.svg";

const { width, height } = Dimensions.get("window");

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
      <StatusBar barStyle="dark-content" backgroundColor="#fff7ed" />

      <LinearGradient
        colors={["#fff7ed", "#ffffff", "#fff7ed"]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {/* Top Header Section */}
            <View 
              style={{ 
                paddingTop: insets.top + 20,
                paddingHorizontal: 24,
                paddingBottom: 40,
                alignItems: 'center'
              }}
            >
              <Animated.View 
                entering={FadeInDown.delay(200).duration(800)}
                style={{ alignItems: 'center' }}
              >
                <LogoSvg width={120} height={120} />
                <Text style={{
                  fontSize: 28,
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginTop: 20,
                  marginBottom: 8,
                  textAlign: 'center'
                }}>
                  Welcome Back
                </Text>
                <Text style={{
                  fontSize: 16,
                  color: '#6b7280',
                  textAlign: 'center'
                }}>
                  Sign in to your KPM Partner account
                </Text>
              </Animated.View>
            </View>

            {/* Login Form Card */}
            <Animated.View 
              entering={FadeInUp.delay(400).duration(800)}
              style={{
                backgroundColor: 'white',
                marginHorizontal: 20,
                borderRadius: 24,
                padding: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 8,
                marginBottom: 20
              }}
            >
              {/* Form Header */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: 8
                }}>
                  Let's get you signed in
                </Text>
                <Text style={{
                  fontSize: 16,
                  color: '#6b7280'
                }}>
                  Enter your phone number to continue
                </Text>
              </View>

              {/* Phone Input */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: 8
                }}>
                  Phone Number
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#f9fafb',
                  borderWidth: 2,
                  borderColor: phoneNumber ? (isValidPhone ? '#10b981' : '#ef4444') : '#e5e7eb',
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginRight: 8 }}>
                      🇮🇳 +91
                    </Text>
                    <View style={{ width: 1, height: 20, backgroundColor: '#d1d5db', marginRight: 12 }} />
                  </View>
                  <Ionicons 
                    name="call-outline" 
                    size={20} 
                    color={phoneNumber ? (isValidPhone ? "#10b981" : "#ef4444") : "#f97316"} 
                  />
                  <TextInput
                    placeholder="98765 43210"
                    keyboardType="phone-pad"
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      fontSize: 16,
                      color: '#1f2937',
                      fontWeight: '600'
                    }}
                    placeholderTextColor="#9ca3af"
                    value={phoneNumber}
                    onChangeText={handlePhoneChange}
                    maxLength={11}
                    autoFocus={false}
                  />
                  {phoneNumber && (
                    <View style={{ marginLeft: 8 }}>
                      {isValidPhone ? (
                        <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                      ) : (
                        <Ionicons name="close-circle" size={20} color="#ef4444" />
                      )}
                    </View>
                  )}
                </View>
                {phoneNumber && !isValidPhone && (
                  <Text style={{
                    color: '#ef4444',
                    fontSize: 12,
                    marginTop: 6,
                    marginLeft: 4
                  }}>
                    Please enter a valid 10-digit Indian mobile number
                  </Text>
                )}
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                onPress={() => {
                  if (isValidPhone) {
                    router.push("/(auth)/otp");
                  }
                }}
                activeOpacity={0.8}
                disabled={!isValidPhone}
                style={{
                  marginBottom: 20,
                  shadowColor: "#f97316",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isValidPhone ? 0.3 : 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <LinearGradient
                  colors={isValidPhone ? ["#f97316", "#fb923c"] : ["#e5e7eb", "#d1d5db"]}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 24,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: isValidPhone ? 'white' : '#9ca3af',
                      marginRight: 8
                    }}>
                      Continue
                    </Text>
                    <Ionicons 
                      name="arrow-forward" 
                      size={16} 
                      color={isValidPhone ? 'white' : '#9ca3af'} 
                    />
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Terms */}
              <Text style={{
                fontSize: 12,
                color: '#6b7280',
                textAlign: 'center',
                lineHeight: 16
              }}>
                By continuing, you agree to our{" "}
                <Text style={{ color: '#f97316', fontWeight: '600' }}>Terms of Service</Text> and{" "}
                <Text style={{ color: '#f97316', fontWeight: '600' }}>Privacy Policy</Text>
              </Text>
            </Animated.View>

            {/* Bottom Spacer */}
            <View style={{ height: Math.max(insets.bottom, 20) }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}