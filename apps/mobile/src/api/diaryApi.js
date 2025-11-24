// src/api/diaryApi.js
import { httpClient } from "./client";

export const diaryApi = {
  getAll: () => httpClient.get("/api/diary"),
  getByDate: (date) => httpClient.get(`/api/diary/${date}`),
  save: (data) => httpClient.post("/api/diary", data),
  delete: (date) => httpClient.delete(`/api/diary/${date}`),
};
