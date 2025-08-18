import { Tabs } from "expo-router";

export default function AppNavigator() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="(home)/index" options={{ title: "Home" }} />
      <Tabs.Screen name="(home)/explore" options={{ title: "Explore" }} />
    </Tabs>
  );
}
