// src/api/bgmApi.js
import { httpClient } from "./client";

export const bgmApi = {
  getByDiary: (diary_id) => httpClient.get(`/bgm/diary/${diary_id}`),
};
