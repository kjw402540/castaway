import "react-native-gesture-handler";
import React from "react";
import { EmotionProvider } from "./src/context/EmotionContext";
import { SoundProvider } from "./src/context/SoundContext";
import AppNavigator from "./src/app/AppNavigator";

export default function App() {
  return (
    <EmotionProvider>
      <SoundProvider>
        <AppNavigator />
      </SoundProvider>
    </EmotionProvider>
  );
}
