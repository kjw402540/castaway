// src/api/diaryApi.js
import { httpClient } from "./client";

export const diaryApi = {
  getAll: () => httpClient.get("/diary"),
  getByDate: (date) => httpClient.get(`/diary/${date}`),

  save: async (data) => {
    const res = await httpClient.post("/diary", data);
    return res; // 🔥 반드시 응답 반환!
  },

  delete: (date) => httpClient.delete(`/diary/${date}`),
};
