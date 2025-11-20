import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// =================================================
// ★ [개발자용 치트키]
// true: "나 개발자야! 바로 홈으로 보내줘"
// false: "로그인 화면 디자인 확인할래"
// =================================================
const IS_DEV_LOGGED_IN = false; 

export default function SplashPage({ navigation }) {
  
  useEffect(() => {
    const checkLoginStatus = async () => {
      // 1. 실제 앱이라면? 여기서 AsyncStorage.getItem('userToken') 같은 걸 함
      // const userToken = await AsyncStorage.getItem('userToken');
      
      // 2. 지금은 개발자 변수로 퉁치기
      const isLoggedIn = IS_DEV_LOGGED_IN; 

      // 2초 딜레이 (로고 보여주기)
      setTimeout(() => {
        if (isLoggedIn) {
          console.log("🚀 자동 로그인 성공! 홈으로 이동합니다.");
          navigation.replace('Home'); // 홈으로 납치
        } else {
          console.log("🔒 로그인 필요. 로그인 페이지로 이동합니다.");
          navigation.replace('Login'); // 로그인 페이지로
        }
      }, 2000);
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
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    color: '#6B7280',
  }
});