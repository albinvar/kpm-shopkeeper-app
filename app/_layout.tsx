// app/_layout.tsx
import RootNavigator from "../navigation/RootNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BackConfirmationProvider } from "../contexts/BackConfirmationContext";
import "./global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BackConfirmationProvider>
        <RootNavigator />
      </BackConfirmationProvider>
    </GestureHandlerRootView>
  );
}
