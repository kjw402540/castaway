import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

/* ===== 공통 레이아웃 ===== */
import MainLayout from "../components/common/MainLayout";

/* ===== 페이지 ===== */
import SplashPage from "../screens/Splash/SplashPage";
import LoginPage from "../screens/Login/LoginPage"; 
import SignUpPage from "../screens/Login/SignUpPage";
import HomePage from "../screens/Home/HomePage";
import DiaryPage from "../screens/Diary/DiaryPage";
import ObjectsPage from "../screens/Objects/ObjectsPage";
import MusicPage from "../screens/Music/MusicPage";
import ProfilePage from "../screens/Profile/ProfilePage";
import ReportPage from "../screens/Report/ReportPage";
import HistoryReportPage from "../screens/Report/HistoryReportPage";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />

      <Stack.Navigator
        initialRouteName="Splash"  // [변경] 시작 화면을 Splash로 설정!
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        {/* ============================================= */}
        {/* 1. 진입 & 인증 구간 (하단 탭바 없음)          */}
        {/* ============================================= */}
        
        {/* 스플래시 (진입 화면) */}
        <Stack.Screen name="Splash" component={SplashPage} />

        {/* 로그인 페이지 */}
        <Stack.Screen name="Login" component={LoginPage} />

        {/* 회원가입 페이지 */}
        <Stack.Screen name="SignUp" component={SignUpPage} />


        {/* ============================================= */}
        {/* 2. 메인 앱 구간 (하단 탭바 있음 - MainLayout) */}
        {/* ============================================= */}

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

        {/* Music */}
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

        {/* HistoryReport */}
        <Stack.Screen name="HistoryReport">
          {() => (
            <MainLayout>
              <HistoryReportPage />
            </MainLayout>
          )}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
}