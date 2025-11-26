import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔑 앞으로는 진짜 토큰 기반으로 체크할 거라 치트키는 제거!
export default function SplashPage({ navigation }) {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // 나중에 카카오 로그인 완료되면 여기 키로 JWT 저장할 거야
        const token = await AsyncStorage.getItem("castaway_auth_token");

        // 2초 딜레이는 그냥 기존 연출 유지 (원하면 줄이거나 없애도 됨)
        setTimeout(() => {
          if (token) {
            console.log("🚀 자동 로그인 성공! 홈으로 이동합니다.");
            navigation.replace("Home");
          } else {
            console.log("🔒 토큰 없음. 로그인 페이지로 이동합니다.");
            navigation.replace("Login");
          }
        }, 2000);
      } catch (e) {
        console.log("스플래시 토큰 체크 에러:", e);
        navigation.replace("Login");
      }
    };

    checkLoginStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Castaway</Text>
      <Text style={styles.subTitle}>나를 찾아 떠나는 항해</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    color: "#6B7280",
  },
});
