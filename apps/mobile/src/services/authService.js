// src/services/authService.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "castaway_auth_token";

// 토큰 저장
export async function saveAuthToken(token) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

// 토큰 조회
export async function getAuthToken() {
  return await AsyncStorage.getItem(TOKEN_KEY);
}

// 토큰 삭제
export async function clearAuthToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

// 로그인 후 받은 결과 처리 (토큰 저장)
export async function applyLoginResult(result) {
  if (result?.token) {
    await saveAuthToken(result.token);
  }
  return result;
}
