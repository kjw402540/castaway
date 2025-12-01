// src/api/client.js
// 서버 요청 공통 처리: Authorization + BASE_URL + 예외 처리

import { BASE_URL } from "../config/apiConfig";
import * as SecureStore from "expo-secure-store";

// 인증 토큰 포함 헤더 생성
async function buildHeaders(extra = {}) {
  const token = await SecureStore.getItemAsync("accessToken");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

// ★ 클라이언트에서 모든 API는 이걸로 보냄 ("/api" 자동 포함됨)
export async function request(method, path, body = null, extraHeaders = {}) {
  const headers = await buildHeaders(extraHeaders);

  const options = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  // BASE_URL + "/api" + path 결합
  const fullUrl = `${BASE_URL}/api${path}`;

  try {
    const res = await fetch(fullUrl, options);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const error = new Error(errorData.message || "요청 처리 실패");
      error.status = res.status;
      throw error;
    }

    if (res.status === 204) return true;
    return res.json();

  } catch (err) {
    console.error(`[HTTP ${method}] ${path}`, err);
    throw err;
  }
}

// GET / POST / PATCH / DELETE 간단 wrapper
export const httpClient = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  patch: (path, body) => request("PATCH", path, body),
  delete: (path) => request("DELETE", path),
};
