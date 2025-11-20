// ★ 설정 불러오기
import { USE_API, BASE_URL, HEADERS } from "../../config/apiConfig";

// 가짜 데이터
let mockProfileData = {
  nickname: "가지볶음",
  email: "email@domain.com",
  bgm: false,
  effect: false,
  reminder: false,
};

// [GET] 프로필 불러오기
export async function getProfile() {
  if (USE_API) {
    try {
      const response = await fetch(`${BASE_URL}/profile`, { headers: HEADERS });
      if (!response.ok) throw new Error("실패");
      return await response.json();
    } catch (error) {
      console.error(error);
      return mockProfileData;
    }
  } else {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockProfileData), 500);
    });
  }
}

// [PATCH] 프로필 업데이트
export async function updateProfile(key, value) {
  if (USE_API) {
    try {
      const response = await fetch(`${BASE_URL}/profile`, {
        method: "PATCH",
        headers: HEADERS,
        body: JSON.stringify({ [key]: value }),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  } else {
    mockProfileData[key] = value;
    return true;
  }
}