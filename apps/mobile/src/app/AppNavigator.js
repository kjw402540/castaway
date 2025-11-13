import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import MainPage from "../screens/Main/MainPage";
import ProfilePage from "../screens/Profile/ProfilePage"
import ReportPage from "../screens/Report/ReportPage"
import { DiaryProvider } from "../context/DiaryContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <DiaryProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Main"
          screenOptions={{
            headerShown: false,
            animation: "fade",
          }}
        >
          <Stack.Screen name="Main" component={MainPage} />
          <Stack.Screen name="Profile" component={ProfilePage} />
          <Stack.Screen name="Report" component={ReportPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </DiaryProvider>
  );
}
