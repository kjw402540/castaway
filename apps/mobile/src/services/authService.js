// src/services/authService.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userApi } from "../api/userApi"; // 🔥 통합된 userApi 사용

const TOKEN_KEY = "castaway_auth_token";

// ===============================
// 🔒 토큰 관련 유틸 함수 (그대로 유지)
// ===============================
export async function saveAuthToken(token) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getAuthToken() {
  return await AsyncStorage.getItem(TOKEN_KEY);
}

export async function clearAuthToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

// (나중에 API 호출할 때 헤더가 필요하면 사용)
export async function getAuthHeader() {
  const token = await getAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
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