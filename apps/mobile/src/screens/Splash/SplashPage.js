// src/screens/Splash/SplashPage.js

import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getAuthToken } from "../../services/authService"; 

export default function SplashPage({ navigation }) {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await getAuthToken();

        // 2초 딜레이 (로고 보여주는 시간)
        setTimeout(() => {
          if (token) {
            navigation.replace("Home");
          } else {
            console.log("🔒 [Splash] 토큰 없음. 로그인으로 이동.");
            navigation.replace("Login");
          }
        }, 2000);

      } catch (e) {
        console.error("스플래시 에러:", e);
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