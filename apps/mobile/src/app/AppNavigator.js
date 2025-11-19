import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

/* ===== 공통 레이아웃 ===== */
import MainLayout from "../components/common/MainLayout";

/* ===== 페이지 ===== */
import HomePage from "../screens/Home/HomePage";
import DiaryPage from "../screens/Diary/DiaryPage";
import ObjectsPage from "../screens/Objects/ObjectsPage";
import MusicPage from "../screens/Music/MusicPage";      // ★ 추가
import ProfilePage from "../screens/Profile/ProfilePage";
import ReportPage from "../screens/Report/ReportPage";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />

      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        {/* Home */}
        <Stack.Screen name="Home">
          {() => (
            <MainLayout>
              <HomePage />
            </MainLayout>
          )}
        </Stack.Screen>

        {/* Diary */}
        <Stack.Screen name="Diary">
          {() => (
            <MainLayout>
              <DiaryPage />
            </MainLayout>
          )}
        </Stack.Screen>

        {/* Objects */}
        <Stack.Screen name="Objects">
          {() => (
            <MainLayout>
              <ObjectsPage />
            </MainLayout>
          )}
        </Stack.Screen>

        {/* Music — ★ 새로 추가됨 */}
        <Stack.Screen name="Music">
          {() => (
            <MainLayout>
              <MusicPage />
            </MainLayout>
          )}
        </Stack.Screen>

        {/* Profile */}
        <Stack.Screen name="Profile">
          {() => (
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          )}
        </Stack.Screen>

        {/* Report */}
        <Stack.Screen name="Report">
          {() => (
            <MainLayout>
              <ReportPage />
            </MainLayout>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
