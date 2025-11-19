// src/screens/Profile/ProfileService.js

let profileData = {
  nickname: "가지볶음",
  email: "email@domain.com",
  bgm: false,
  effect: false,
  reminder: false,
};

// 프로필 불러오기
export async function getProfile() {
  return profileData;
}

// 특정 필드 업데이트
export async function updateProfile(key, value) {
  profileData[key] = value;
  return true;
}
