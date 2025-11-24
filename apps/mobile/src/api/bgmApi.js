// src/api/bgmApi.js
import { httpClient } from "./client";

export const bgmApi = {

  // 특정 일기의 BGM 조회
  getByDiary: (diaryId) =>
    httpClient.get(`/bgm/diary/${diaryId}`),

  // 전체 BGM 조회
  getAll: () =>
    httpClient.get(`/bgm`),

  // 음악 삭제  (→ 일기/오브제/BGM 세트 삭제)
  delete: (bgmId) =>
    httpClient.delete(`/bgm/${bgmId}`),
};
