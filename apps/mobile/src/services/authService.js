// src/services/authService.js
import * as SecureStore from 'expo-secure-store'; // ✅ 수정: AsyncStorage -> SecureStore
import { userApi } from "../api/userApi";

// ✅ 수정: client.js가 찾는 키 이름("accessToken")과 똑같이 맞춰줍니다.
const TOKEN_KEY = "accessToken"; 

// 토큰 저장
export async function saveAuthToken(token) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

// 토큰 조회
export async function getAuthToken() {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

// 토큰 삭제
export async function clearAuthToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY); // SecureStore는 deleteItemAsync 사용
}

// (나중에 API 호출할 때 헤더가 필요하면 사용)
export async function getAuthHeader() {
  const token = await getAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

// 로그인 후 받은 결과 처리 (토큰 저장)
export async function applyLoginResult(result) {
  if (result?.token) {
    await saveAuthToken(result.token);
  }
  return result;
}

// ===============================
// 📨 이메일 회원가입 API
// ===============================
export async function signup(email, password, nickname) {
  return await userApi.signup({ email, password, nickname });
}

// ===============================
// 📨 이메일 로그인 API
// ===============================
export async function login(email, password) {
  return await userApi.login({ email, password });
}