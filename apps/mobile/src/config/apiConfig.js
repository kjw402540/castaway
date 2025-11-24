// src/config/apiConfig.js

export const USE_API = false; 
// export const BASE_URL = "http://10.0.2.2:3000/api"; 
export const BASE_URL = process.env.EXPO_PUBLIC_API_BASE; 

export const HEADERS = {
  "Content-Type": "application/json",
};

// ====================================================
// ★ 카카오 설정 추가
// ====================================================
export const KAKAO_CONFIG = {
  // [필수] 카카오 개발자 센터 -> 내 애플리케이션 -> 앱 키 -> REST API 키 복사해서 붙여넣기
  APP_KEY: "393f7dea023a0789c771c86ebb332b3d", 
  
  // 카카오 로그인 후 돌아올 주소 (Expo 기본 리다이렉트)
  // 카카오 개발자 센터 -> 카카오 로그인 -> Redirect URI에 아래 주소를 꼭 추가해야 함!
  // 보통: https://auth.expo.io/@사용자명/프로젝트명 (Expo Go 사용 시 로그 찍어서 확인 필요)
};