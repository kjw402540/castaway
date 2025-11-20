// ★ 위에서 만든 설정을 불러옵니다. (경로 주의)
import { USE_API, BASE_URL, HEADERS } from "../../config/apiConfig";

// 1. 회원가입 API
export async function signup(email, password, nickname) {
  if (USE_API) {
    // [Real] 실제 서버 통신
    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({ email, password, nickname }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "회원가입 실패");
      
      return data; // { success: true, ... }
    } catch (error) {
      console.error("Signup Error:", error);
      throw error;
    }
  } else {
    // [Mock] 가짜 데이터 (1초 딜레이)
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[Mock] 가입 성공: ${nickname}`);
        resolve({ success: true });
      }, 1000);
    });
  }
}

// 2. 로그인 API
export async function login(provider, email) {
  if (USE_API) {
    // [Real]
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({ provider, email }),
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  } else {
    // [Mock]
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[Mock] ${provider} 로그인 성공`);
        resolve({ success: true, token: "dummy_token_123" });
      }, 800);
    });
  }
}