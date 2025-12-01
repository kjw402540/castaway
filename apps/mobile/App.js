import "react-native-gesture-handler";
import React from "react";
import { ThemeProvider } from "./src/context/ThemeContext"; // 🔥 변경
import { SoundProvider } from "./src/context/SoundContext";
import AppNavigator from "./src/app/AppNavigator";

export default function App() {
  return (
    <ThemeProvider>
      <SoundProvider>
        <AppNavigator />
      </SoundProvider>
    </ThemeProvider>
  );
}
