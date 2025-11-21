import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function LoginPage({ navigation }) {

  // 로그인 버튼 클릭 시 실행되는 함수 (개발용 시뮬레이션)
  const handleLogin = (platform) => {
    console.log(`🚀 ${platform} 로그인 시도...`);

    // [개발용] API 연동 전이므로, 버튼 누르면 무조건 홈으로 이동시킴
    // replace를 써야 뒤로가기 했을 때 다시 로그인 화면으로 안 돌아옴
    navigation.replace("Home");
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* 1. 상단 브랜딩 영역 (로고 + 슬로건) */}
      <View style={styles.logoArea}>
        {/* 로고 아이콘 (임시로 이모지 사용, 나중에 이미지로 교체 가능) */}
        <View style={styles.logoPlaceholder}>
          <Text style={{ fontSize: 50 }}>🏝️</Text>
        </View>

        <Text style={styles.brandName}>Castaway</Text>
        <Text style={styles.slogan}>
          표류하는 감정들을 위한,{"\n"}각자의 세계
        </Text>
      </View>

      {/* 2. 하단 버튼 영역 */}
      <View style={styles.buttonArea}>

        {/* 카카오 로그인 */}
        <TouchableOpacity
          style={[styles.socialBtn, { backgroundColor: "#FEE500", borderWidth: 0 }]}
          onPress={() => handleLogin("Kakao")}
          activeOpacity={0.8}
        >
          {/* 카카오 심볼은 텍스트나 이미지로 대체 가능 */}
          <Text style={[styles.socialText, { color: "#3C1E1E" }]}>카카오로 3초 만에 시작하기</Text>
        </TouchableOpacity>

        {/* 구글 로그인 */}
        <TouchableOpacity
          style={styles.socialBtn}
          onPress={() => handleLogin("Google")}
          activeOpacity={0.8}
        >
          <Text style={styles.socialText}>Google로 계속하기</Text>
        </TouchableOpacity>

        {/* 이메일 가입 링크 */}
        <TouchableOpacity
          style={styles.emailLink}
          onPress={() => navigation.navigate("SignUp")} // [연결]
        >
          <Text style={styles.emailText}>이메일로 회원가입</Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingBottom: 40, // 하단 여백 확보
  },
  // === 로고 영역 ===
  logoArea: {
    flex: 1, // 남은 공간을 모두 차지해서 중앙 정렬 유도
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50, // 시각적으로 살짝 위로 올림
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#F3F4F6", // 연한 회색 배경
    borderRadius: 30, // 둥근 모서리
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  brandName: {
    fontSize: 36,
    fontWeight: "800", // 굵게
    color: "#1E3A8A", // 딥 블루 (Wilson 브랜드 컬러)
    marginBottom: 12,
  },
  slogan: {
    textAlign: "center",
    fontSize: 16,
    color: "#6B7280", // 회색 텍스트
    lineHeight: 24,
  },

  // === 버튼 영역 ===
  buttonArea: {
    width: "100%",
    alignItems: "center",
  },
  socialBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    // 구글 버튼용 기본 스타일 (흰색 배경 + 테두리)
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  socialText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  emailLink: {
    marginTop: 10,
    padding: 10,
  },
  emailText: {
    color: "#9CA3AF",
    fontSize: 14,
    textDecorationLine: "underline", // 밑줄
  },
});