import "react-native-gesture-handler";
import React from "react";
import { EmotionProvider } from "./src/context/EmotionContext";
import AppNavigator from "./src/app/AppNavigator";

export default function App() {
  return (
    <EmotionProvider>
      <AppNavigator />
    </EmotionProvider>
  );
}
