// src/screens/Auth/SignInPage.js

import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  KeyboardAvoidingView, Platform, ScrollView, Alert 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// 💡 아까 리팩토링한 authService에서 함수들 가져오기
import { login, saveAuthToken } from "../../services/authService";

export default function SignInPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔙 뒤로가기
  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.replace("Login");
    }
  };

  const handleSignIn = async () => {
    // 1. 유효성 검사
    if (!email || !password) {
      Alert.alert("알림", "이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      // 2. 로그인 요청 (authService -> userApi -> Server)
      const res = await login(email, password);
      // 예상 응답: { token: "...", user: {...} }

      if (!res || !res.token) {
        throw new Error("서버 응답에 토큰이 없습니다.");
      }

      // 3. 토큰 저장 (중요! 이게 되어야 이후 API 호출 가능)
      await saveAuthToken(res.token);

      // 4. 메인 화면으로 이동 (스택 초기화)
      // "Home" 혹은 "MainTabs" 등 App.js에 등록된 메인 화면 이름으로 맞춰주세요.
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }], 
      });

    } catch (error) {
      console.log("로그인 에러:", error);
      Alert.alert(
        "로그인 실패",
        error.message || "이메일 또는 비밀번호를 확인해주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>로그인</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.formContainer}>
          
          {/* 이메일 입력 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>이메일</Text>
            <TextInput 
              style={styles.input} 
              placeholder="email@domain.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              autoComplete="email"
            />
          </View>

          {/* 비밀번호 입력 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput 
              style={styles.input} 
              placeholder="비밀번호 입력"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              autoComplete="password"
            />
          </View>

          {/* 로그인 버튼 */}
          <TouchableOpacity 
            style={[styles.submitBtn, loading && styles.disabledBtn]} 
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.submitBtnText}>
                {loading ? "로그인 중..." : "로그인"}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  backBtn: { padding: 5 },
  formContainer: { padding: 24, paddingTop: 40 }, // 위쪽 여백 살짝 줌
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#111827",
  },
  submitBtn: {
    backgroundColor: "#1E3A8A",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 30, // 버튼 간격
    shadowColor: "#1E3A8A",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  disabledBtn: {
    backgroundColor: "#9CA3AF", // 로딩 중 회색 처리
  },
  submitBtnText: { color: "white", fontSize: 16, fontWeight: "bold" },
});