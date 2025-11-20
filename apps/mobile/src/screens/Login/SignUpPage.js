import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  KeyboardAvoidingView, Platform, ScrollView, Alert 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// 서비스 연결
import { signup } from "../../services/authService";

export default function SignUpPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [nickname, setNickname] = useState("");

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

    // 2. 서비스 호출
    try {
      const result = await signup(email, password, nickname);
      
      // 성공 시 로직 수정
      if (result && (result.success || result)) { // Mock 데이터 구조에 따라 유연하게
        Alert.alert(
          "환영합니다!",
          "Castaway의 조난자가 되신 걸 환영합니다.",
          [
            {
              text: "확인",
              // [수정] 확인 버튼 누르면 홈 화면으로 바로 이동 (뒤로가기 방지)
              onPress: () => navigation.replace("Home") 
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert("오류", "회원가입 중 문제가 발생했습니다.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>회원가입</Text>
        <View style={{width: 24}} />
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
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>닉네임</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Castaway에서 사용할 이름"
              value={nickname}
              onChangeText={setNickname}
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
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: "#F3F4F6",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  backBtn: { padding: 5 },
  formContainer: { padding: 24 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  input: {
    backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB",
    borderRadius: 10, paddingVertical: 12, paddingHorizontal: 15,
    fontSize: 16, color: "#111827",
  },
  submitBtn: {
    backgroundColor: "#1E3A8A", borderRadius: 12, paddingVertical: 16,
    alignItems: "center", marginTop: 20,
    shadowColor: "#1E3A8A", shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  submitBtnText: { color: "white", fontSize: 16, fontWeight: "bold" },
});