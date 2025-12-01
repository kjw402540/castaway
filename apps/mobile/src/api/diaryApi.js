// src/api/diaryApi.js
import { httpClient } from "./client";

export const diaryApi = {
  getAll: () => httpClient.get("/diary"),
  getByDate: (date) => httpClient.get(`/diary/${date}`),
  save: (data) => httpClient.post("/diary", data),
  delete: (date) => httpClient.delete(`/diary/${date}`),
};
