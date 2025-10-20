import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="shop-profile" />
      <Stack.Screen name="contact-info" />
      <Stack.Screen name="operating-hours" />
    </Stack>
  );
}
