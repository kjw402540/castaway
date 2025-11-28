// src/api/userApi.js
import { httpClient } from "./client";

export const userApi = {
  signup: (data) => httpClient.post("/auth/signup", data),
  login: (data) => httpClient.post("/auth/login", data),
  logout: () => httpClient.post("/auth/logout"),

  get: () => httpClient.get("/user"),
  update: (data) => httpClient.patch("/user", data),
  delete: () => httpClient.delete("/user"),
};
