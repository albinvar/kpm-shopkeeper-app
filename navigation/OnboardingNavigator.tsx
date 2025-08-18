import { Stack } from "expo-router";

export default function OnboardingNavigator() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(onboarding)/index" />
    </Stack>
  );
}
