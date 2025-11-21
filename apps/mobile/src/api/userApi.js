// src/api/userApi.js
import { httpClient } from "./client";

export const userApi = {

  // 회원가입
  signup: (data) =>
    httpClient.post("/auth/signup", data),

  // 로그인
  login: (data) =>
    httpClient.post("/auth/login", data),

  // 내 정보 조회
  get: () =>
    httpClient.get("/user"),

  // 프로필 수정
  update: (data) =>
    httpClient.patch("/user", data),

  // 로그아웃 (프론트 localStorage 정리용)
  logout: () =>
    httpClient.post("/auth/logout"),

  // 회원 탈퇴
  delete: () =>
    httpClient.delete("/user"),
};
