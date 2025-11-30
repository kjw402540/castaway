// src/api/client.js
import { BASE_URL } from "../config/apiConfig";
import * as SecureStore from 'expo-secure-store';
//import { getAuthToken } from "../services/authService";

async function buildHeaders(extra = {}) {
  const token = await SecureStore.getItemAsync("accessToken");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function request(method, path, body = null, extraHeaders = {}) {
  const headers = await buildHeaders(extraHeaders);

  const options = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  try {
    const fullUrl = `${BASE_URL}/api${path}`;
    const res = await fetch(fullUrl, options);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const error = new Error(errorData.message || "요청 처리 실패");
      error.status = res.status;
      error.code = errorData.code;
      throw error;
    }

    if (res.status === 204) return true;
    return res.json();

  } catch (err) {
    console.error(`[HTTP ${method}] ${path}`, err);
    throw err;
  }
}

export const httpClient = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  patch: (path, body) => request("PATCH", path, body),
  delete: (path, body) => request("DELETE", path, body),
};
