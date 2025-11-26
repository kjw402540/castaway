// src/screens/Login/LoginPage.js

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginPage({ navigation }) {

  const handleKakaoLogin = () => {
    Alert.alert("준비 중", "네이티브 빌드 후 활성화 예정!");
  };

  const handleGoogleLogin = () => {
    Alert.alert("준비 중", "구글 로그인 추후 연동 예정");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoArea}>
        <View style={styles.logoPlaceholder}>
          <Text style={{ fontSize: 50 }}>🏝️</Text>
        </View>

        <Text style={styles.brandName}>Castaway</Text>
        <Text style={styles.slogan}>
          표류하는 감정들을 위한,{"\n"}각자의 세계
        </Text>
      </View>

      <View style={styles.buttonArea}>
        {/* 1. 카카오 */}
        <TouchableOpacity
          style={[
            styles.socialBtn,
            { backgroundColor: "#FEE500", borderWidth: 0 },
          ]}
          onPress={handleKakaoLogin}
          activeOpacity={0.8}
        >
          <Text style={[styles.socialText, { color: "#3C1E1E" }]}>
            카카오로 시작하기
          </Text>
        </TouchableOpacity>

        {/* 2. 구글 */}
        <TouchableOpacity
          style={styles.socialBtn}
          onPress={handleGoogleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.socialText}>Google로 시작하기</Text>
        </TouchableOpacity>

        {/* 3. 이메일 로그인 (간격 수정됨: marginTop 제거) */}
        <TouchableOpacity
          style={styles.socialBtn} // 👈 여기! marginTop 제거함
          onPress={() => navigation.navigate("SignIn")}
          activeOpacity={0.8}
        >
          <Text style={styles.socialText}>이메일로 로그인</Text>
        </TouchableOpacity>

        {/* 4. 하단 회원가입 링크 */}
        <View style={styles.signupTextContainer}>
            <Text style={styles.signupGuideText}>아직 계정이 없으신가요?</Text>
            <TouchableOpacity
                onPress={() => navigation.navigate("SignUp")}
                style={styles.signupLink}
            >
                <Text style={styles.signupText}>이메일 가입</Text>
            </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#F3F4F6",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  brandName: {
    fontSize: 36,
    fontWeight: "800",
    color: "#1E3A8A",
    marginBottom: 12,
  },
  slogan: {
    textAlign: "center",
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
  },
  buttonArea: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 20,
  },
  // 👇 모든 버튼에 공통으로 적용되는 스타일
  socialBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12, // 👈 이 값이 모든 버튼 사이의 간격을 결정합니다 (12px)
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  socialText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  signupTextContainer: {
    flexDirection: 'row',
    marginTop: 10, // 버튼 묶음과 텍스트 사이의 간격
    alignItems: 'center',
  },
  signupGuideText: {
    color: "#9CA3AF",
    fontSize: 14,
    marginRight: 8,
  },
  signupLink: {
    padding: 5,
  },
  signupText: {
    color: "#1E3A8A",
    fontSize: 14,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});