// src/screens/Auth/SignUpPage.js

import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  KeyboardAvoidingView, Platform, ScrollView, Alert 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { signup } from "../../services/authService";

export default function SignUpPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [nickname, setNickname] = useState("");

  // 🔙 뒤로가기 처리: 스택이 없으면 Login으로 보냄
  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.replace("Login");
    }
  };

  const handleSignUp = async () => {
    // 1. 유효성 검사
    if (!email || !password || !nickname) {
      Alert.alert("알림", "모든 정보를 입력해주세요.");
      return;
    }
    if (password !== confirmPw) {
      Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // 2. 서비스 호출 (백엔드 /auth/signup)
      const res = await signup(email, password, nickname);
      // 기대 응답: { token, user }

      if (!res || !res.token) {
        Alert.alert("오류", "회원가입 응답에 토큰이 없습니다.");
        return;
      }

      // 3. JWT 저장
      await AsyncStorage.setItem("castaway_auth_token", res.token);

      // 4. 안내 후 Home으로 reset (뒤로가기 시 로그인/회원가입 안 보이게)
      Alert.alert(
        "환영합니다!",
        "Castaway의 조난자가 되신 걸 환영합니다.",
        [
          {
            text: "확인",
            onPress: () =>
              navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
              }),
          },
        ]
      );
    } catch (error) {
      console.log("회원가입 에러:", error);
      Alert.alert(
        "오류",
        error?.message || "회원가입 중 문제가 발생했습니다."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>회원가입</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.formContainer}>
          
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput 
              style={styles.input} 
              placeholder="6자리 이상 입력해주세요"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              // 🔽 iOS가 강제 비번 추천 안 하도록 힌트 죽이기
              textContentType="none"
              autoComplete="off"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>비밀번호 확인</Text>
            <TextInput 
              style={styles.input} 
              placeholder="비밀번호를 한 번 더 입력해주세요"
              value={confirmPw}
              onChangeText={setConfirmPw}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="none"
              autoComplete="off"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>닉네임</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Castaway에서 사용할 이름"
              value={nickname}
              onChangeText={setNickname}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="nickname"
              autoComplete="off"
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSignUp}>
            <Text style={styles.submitBtnText}>가입하기</Text>
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
  formContainer: { padding: 24 },
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
    marginTop: 20,
    shadowColor: "#1E3A8A",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  submitBtnText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
