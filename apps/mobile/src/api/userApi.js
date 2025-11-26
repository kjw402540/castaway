// src/api/userApi.js
import { httpClient } from "./client";

export const userApi = {

  // [Auth 관련]
  signup: (data) => httpClient.post("/auth/signup", data),
  login: (data) => httpClient.post("/auth/login", data),
  logout: () => httpClient.post("/auth/logout"),

  // [User 정보 관련]
  get: () => httpClient.get("/user"),      
  update: (data) => httpClient.patch("/user", data),
  delete: () => httpClient.delete("/user"),
};
