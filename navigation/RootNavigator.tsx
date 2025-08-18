// navigation/RootNavigator.tsx
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";
import OnboardingNavigator from "./OnboardingNavigator";
import { useGlobalBackConfirmation } from "../hooks/useGlobalBackConfirmation";

export default function RootNavigator() {
  const [loading, setLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Enable global back confirmation when user is authenticated and using main app
  useGlobalBackConfirmation({
    enabled: isAuthenticated && hasSeenOnboarding && !loading,
  });

  useEffect(() => {
    // Simulated async logic, replace with AsyncStorage / secure store
    setTimeout(() => {
      setHasSeenOnboarding(false); // default false
      setIsAuthenticated(false); // default false
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!hasSeenOnboarding) {
    return <OnboardingNavigator />;
  }

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  return <AppNavigator />;
}
