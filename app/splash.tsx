import { router } from "expo-router";
import { useEffect } from "react";
import { Dimensions, Image, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
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
import "./global.css";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const ripple1Scale = useSharedValue(0);
  const ripple2Scale = useSharedValue(0);
  const ripple3Scale = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const dotScale1 = useSharedValue(0);
  const dotScale2 = useSharedValue(0);
  const dotScale3 = useSharedValue(0);

  // Calculate responsive sizes
  const logoSize = Math.min(width, height) * 0.5; // Increased from 0.35 to 0.5
  const rippleSize = Math.min(width, height) * 0.6;

  useEffect(() => {
    // Logo entrance animation with bounce
    logoOpacity.value = withTiming(1, { duration: 500 });
    logoScale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
    });
    
    // Subtle rotation
    logoRotate.value = withSequence(
      withTiming(5, { duration: 300 }),
      withTiming(-5, { duration: 300 }),
      withTiming(0, { duration: 300 })
    );

    // Pulse animation - extended for longer duration
    pulseScale.value = withDelay(
      900,
      withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        4, // Increased repetitions
        false
      )
    );

    // Ripple effects - slower and more prominent
    ripple1Scale.value = withDelay(
      800,
      withTiming(3.5, {
        duration: 3000,
        easing: Easing.out(Easing.ease),
      })
    );
    
    ripple2Scale.value = withDelay(
      1200,
      withTiming(3.5, {
        duration: 3000,
        easing: Easing.out(Easing.ease),
      })
    );
    
    ripple3Scale.value = withDelay(
      1600,
      withTiming(3.5, {
        duration: 3000,
        easing: Easing.out(Easing.ease),
      })
    );

    // Loading dots animation
    dotScale1.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.5, { duration: 300 })
        ),
        -1,
        true
      )
    );
    
    dotScale2.value = withDelay(
      1200,
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
      1400,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.5, { duration: 300 })
        ),
        -1,
        true
      )
    );

    // Text fade in - delayed more for longer screen time
    textOpacity.value = withDelay(2000, withTiming(1, { duration: 1000 }));

    // Navigate after animations - increased delay
    setTimeout(() => {
      router.replace("/(onboarding)");
    }, 6000); // Increased from 4000ms to 6000ms
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value * pulseScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
    opacity: logoOpacity.value,
  }));

  const rippleAnimatedStyle = (rippleScale: any, delay: number) => 
    useAnimatedStyle(() => ({
      transform: [{ scale: rippleScale.value }],
      opacity: interpolate(
        rippleScale.value,
        [0, 0.5, 3],
        [0, 0.3, 0]
      ),
    }));

  const dotAnimatedStyle = (scale: any) => 
    useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: scale.value,
    }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [
      { translateY: interpolate(textOpacity.value, [0, 1], [20, 0]) },
    ],
  }));

  return (
    <View className="flex-1 items-center justify-center bg-gradient-to-br from-orange-50 to-white relative overflow-hidden">
      {/* Background gradient effect */}
      <View className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50 opacity-50" />
      
      {/* Decorative circles */}
      <View className="absolute -top-20 -left-20 w-40 h-40 bg-orange-100 rounded-full opacity-20" />
      <View className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-100 rounded-full opacity-20" />
      <View className="absolute top-1/4 right-10 w-20 h-20 bg-orange-200 rounded-full opacity-10" />

      {/* Ripple effects */}
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
          rippleAnimatedStyle(ripple1Scale, 0),
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
          rippleAnimatedStyle(ripple2Scale, 300),
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
            borderColor: "#fed7aa",
          },
          rippleAnimatedStyle(ripple3Scale, 600),
        ]}
      />

      {/* Logo with shadow */}
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
          style={{
            width: logoSize,
            height: logoSize,
          }}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Brand name or tagline */}
      <Animated.View style={[textAnimatedStyle, { position: "absolute", bottom: height * 0.15 }]}>
        <Text className="text-orange-600 text-2xl font-bold tracking-wider text-center">
          KPM Partner
        </Text>
        <Text className="text-orange-400 text-sm font-medium tracking-widest text-center mt-1">
          SHOPKEEPER APP
        </Text>
      </Animated.View>

      {/* Loading dots */}
      <View className="absolute bottom-20 flex-row space-x-2">
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
  );
}
