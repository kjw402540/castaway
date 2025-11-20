// src/services/authService.js
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";

export async function saveAuthToken(token) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getAuthToken() {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearAuthToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
