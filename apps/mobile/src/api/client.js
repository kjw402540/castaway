// src/api/client.js
import { BASE_URL } from "../config/apiConfig";
import { getAuthToken } from "../services/authService";

async function buildHeaders(extra = {}) {
  const token = await getAuthToken();

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
    // path가 "/auth/login"이면 -> "http://.../api/auth/login"이 됨
    const fullUrl = `${BASE_URL}/api${path}`;
    
    const res = await fetch(fullUrl, options);
    
    if (!res.ok) {
       // 1. 서버가 준 에러 응답(JSON)을 꺼내봅니다.
      const errorData = await res.json().catch(() => ({})); 
      
      // 2. 에러 객체를 만듭니다.
      const error = new Error(errorData.message || "요청 처리 실패");
      error.status = res.status;
      error.code = errorData.code; // P2025 같은 코드도 담아둠
      
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
