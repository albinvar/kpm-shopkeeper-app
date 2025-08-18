// app/_layout.tsx
import RootNavigator from "../navigation/RootNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BackConfirmationProvider } from "../contexts/BackConfirmationContext";
import { AuthProvider } from "../contexts/AuthContext";
import "./global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <BackConfirmationProvider>
          <RootNavigator />
        </BackConfirmationProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
