// (MOBILE) src/api/authApi.js
import { httpClient } from "./client";

export const authApi = {
  kakaoLogin: (accessToken) =>
    httpClient.post("/api/auth/kakao", { accessToken }),
};
