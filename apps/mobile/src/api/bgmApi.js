// src/api/bgmApi.js
import { httpClient } from "./client";

export const bgmApi = {

  // 특정 일기의 BGM 조회
  getByDiary: (diary_id) =>
    httpClient.get(`/bgm/diary/${diary_id}`),


  // 음악 삭제  (→ 일기/오브제/BGM 세트 삭제)
  delete: (bgm_id) =>
    httpClient.delete(`/bgm/${bgm_id}`),
};
