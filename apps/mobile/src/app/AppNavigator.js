// src/navigation/AppNavigator.js (예시 경로)

import "react-native-gesture-handler";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

/* 레이아웃 & 페이지들 */
import MainLayout from "../components/common/MainLayout";
import SplashPage from "../screens/Splash/SplashPage";
import LoginPage from "../screens/Login/LoginPage";
import SignUpPage from "../screens/Login/SignUpPage";
import SignInPage from "../screens/Login/SignInPage"; // 👈 [추가] 파일 위치 확인 필요!
import HomePage from "../screens/Home/HomePage";
import DiaryPage from "../screens/Diary/DiaryPage";
import ObjectPage from "../screens/Object/ObjectPage";
import ProfilePage from "../screens/Profile/ProfilePage";
import ReportPage from "../screens/Report/ReportPage";
import HistoryReportPage from "../screens/Report/HistoryReportPage";
import MailPage from "../screens/Mail/MailPage";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="auto" />

        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            animation: "fade",
          }}
        >
          {/* 인증 관련 */}
          <Stack.Screen name="Splash" component={SplashPage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="SignIn" component={SignInPage} /> 
          {/* 👆 [추가] 이제 navigation.navigate('SignIn') 가능 */}
          <Stack.Screen name="SignUp" component={SignUpPage} />

          {/* 메인 */}
          <Stack.Screen name="Home">
            {() => (
              <MainLayout>
                <HomePage />
              </MainLayout>
            )}
          </Stack.Screen>

          <Stack.Screen name="Diary">
            {() => (
              <MainLayout>
                <DiaryPage />
              </MainLayout>
            )}
          </Stack.Screen>

          <Stack.Screen name="Object">
            {() => (
              <MainLayout>
                <ObjectPage />
              </MainLayout>
            )}
          </Stack.Screen>

          <Stack.Screen name="Mail">
            {() => (
              <MainLayout>
                <MailPage />
              </MainLayout>
            )}
          </Stack.Screen>

          <Stack.Screen name="Profile">
            {() => (
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            )}
          </Stack.Screen>

          <Stack.Screen name="Report">
            {() => (
              <MainLayout>
                <ReportPage />
              </MainLayout>
            )}
          </Stack.Screen>

          <Stack.Screen name="HistoryReport">
            {(() => (
              <MainLayout>
                <HistoryReportPage />
              </MainLayout>
            ))}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}