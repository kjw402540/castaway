import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationBar from "./NavigationBar";

export default function MainLayout({ children }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ flex: 1 }}>{children}</View>
      <NavigationBar />
    </SafeAreaView>
  );
}
