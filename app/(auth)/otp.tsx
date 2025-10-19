import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import ErrorModal from "../../components/ErrorModal";

const { width } = Dimensions.get("window");

export default function OtpScreen() {
  const insets = useSafeAreaInsets();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorModal, setErrorModal] = useState({ visible: false, message: '', title: 'Error' });
  const [successModal, setSuccessModal] = useState({ visible: false, message: '' });
  const { verifyOtpAndLogin, phoneNumber, sendOtp } = useAuth();

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-navigate to next input if text is entered
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Auto-navigate to previous input on backspace if current field is empty
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
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
        <View className="items-center justify-center flex-1 px-8 relative">
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

          {/* Main Content */}
          <View className="items-center relative z-10">
            {/* Logo */}
            <Animated.View 
              entering={FadeInUp.delay(200)}
              className="items-center mb-12" 
              style={{ marginTop: insets.top + 60 }}
            >
              <View className="relative">
                <View className="absolute -inset-4 bg-white/40 rounded-full blur-sm" />
                <Image
                  source={require("../../assets/images/logo.png")}
                  style={{
                    width: 160,
                    height: 160,
                  }}
                  resizeMode="contain"
                />
              </View>
            </Animated.View>

            {/* Instruction Text */}
            <Animated.View 
              entering={FadeInUp.delay(300)}
              className="items-center mb-10"
            >
              <Text className="text-2xl font-bold text-gray-900 mb-3">
                Enter Verification Code
              </Text>
              <Text className="text-center text-gray-600 text-base px-4 leading-5">
                We've sent a 4-digit code to your phone number
              </Text>
            </Animated.View>

            {/* OTP Input Boxes */}
            <Animated.View 
              entering={FadeInUp.delay(400)}
              className="flex-row gap-4 mb-12"
            >
              {[...Array(4)].map((_, index) => (
                <View
                  key={index}
                  style={{
                    shadowColor: "#f97316",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  <TextInput
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    value={otp[index]}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    maxLength={1}
                    keyboardType="numeric"
                    className="w-16 h-16 text-xl font-bold text-center border-2 border-gray-200 rounded-2xl bg-white focus:border-orange-400 focus:bg-orange-50"
                    autoFocus={index === 0}
                  />
                </View>
              ))}
            </Animated.View>

            {/* Button */}
            <Animated.View
              entering={FadeInUp.delay(500)}
              className="items-center w-full mb-8"
            >
              <TouchableOpacity
                onPress={async () => {
                  const otpString = otp.join('');
                  if (otpString.length !== 4) {
                    setErrorModal({
                      visible: true,
                      title: 'Incomplete OTP',
                      message: 'Please enter all 4 digits of the OTP code.',
                    });
                    return;
                  }

                  if (!phoneNumber) {
                    setErrorModal({
                      visible: true,
                      title: 'Error',
                      message: 'Phone number not found. Please go back and try again.',
                    });
                    return;
                  }

                  setIsLoading(true);
                  try {
                    const result = await verifyOtpAndLogin(phoneNumber, otpString);

                    if (result.success) {
                      // Navigate to initializing screen to show setup animation
                      router.replace('/(auth)/initializing');
                    } else {
                      setErrorModal({
                        visible: true,
                        title: 'Verification Failed',
                        message: result.message,
                      });
                    }
                  } catch (error: any) {
                    setErrorModal({
                      visible: true,
                      title: 'Verification Failed',
                      message: error.message || 'Failed to verify OTP',
                    });
                  } finally {
                    setIsLoading(false);
                  }
                }}
                activeOpacity={0.9}
                disabled={isLoading || otp.join('').length !== 4}
                style={{
                  shadowColor: "#f97316",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  elevation: 6,
                }}
              >
                <LinearGradient
                  colors={otp.join('').length === 4 && !isLoading ? ["#f97316", "#fb923c"] : ["#d1d5db", "#9ca3af"]}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 40,
                    borderRadius: 16,
                    width: width * 0.75,
                    alignItems: 'center'
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text className={`text-lg font-bold ${otp.join('').length === 4 ? 'text-white' : 'text-gray-400'}`}>
                      Verify Now
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Resend text */}
            <Animated.View entering={FadeInDown.delay(600)}>
              <Text className="text-base text-center text-gray-600 mb-12">
                Didn't receive the code?{' '}
                <Text
                  className={`font-semibold ${isResending ? 'text-gray-400' : 'text-orange-500'}`}
                  onPress={async () => {
                    if (isResending || !phoneNumber) return;

                    setIsResending(true);
                    try {
                      const result = await sendOtp(phoneNumber);
                      if (result.success) {
                        setSuccessModal({
                          visible: true,
                          message: 'OTP has been resent successfully. Please check your phone.',
                        });
                        // Clear existing OTP
                        setOtp(["", "", "", ""]);
                      } else {
                        setErrorModal({
                          visible: true,
                          title: 'Resend Failed',
                          message: result.message,
                        });
                      }
                    } catch (error: any) {
                      setErrorModal({
                        visible: true,
                        title: 'Resend Failed',
                        message: error.message || 'Failed to resend OTP',
                      });
                    } finally {
                      setIsResending(false);
                    }
                  }}
                >
                  {isResending ? 'Sending...' : 'Resend'}
                </Text>
              </Text>
            </Animated.View>
          </View>
        </View>
      </LinearGradient>

      {/* Error Modal */}
      <ErrorModal
        visible={errorModal.visible}
        title={errorModal.title}
        message={errorModal.message}
        onClose={() => setErrorModal({ visible: false, message: '', title: 'Error' })}
      />

      {/* Success Modal */}
      <ErrorModal
        visible={successModal.visible}
        title="Success!"
        message={successModal.message}
        type="info"
        onClose={() => setSuccessModal({ visible: false, message: '' })}
      />
    </>
  );
}