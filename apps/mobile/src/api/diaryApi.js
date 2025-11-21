// src/api/diaryApi.js
import { httpClient } from "./client";

export const diaryApi = {

  // 전체 일기 리스트 조회
  getAll: () =>
    httpClient.get("/diary"),


  // 특정 날짜 일기 조회  (YYYY-MM-DD)
  getByDate: (date) =>
    httpClient.get(`/diary/${date}`),


  // 일기 저장 (신규 작성 + 수정)
  save: (data) =>
    httpClient.post("/diary", data),


  // 일기 삭제  (→ 하루 세트 삭제)
  delete: (date) =>
    httpClient.delete(`/diary/${date}`),
};
