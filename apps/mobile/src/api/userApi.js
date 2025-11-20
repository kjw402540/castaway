// src/api/userApi.js
import { httpClient } from "./client";

export const userApi = {
  // 내 정보 조회
  get: () => httpClient.get("/user"),

  // 프로필 수정
  update: (data) => httpClient.patch("/user", data),

  // 로그아웃 (토큰 삭제)
  logout: () => httpClient.post("/auth/logout"),

  // 회원 탈퇴
  delete: () => httpClient.delete("/user"),
};
