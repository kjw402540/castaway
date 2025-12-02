// src/api/reportApi.js
import { httpClient } from "./client";

export const reportApi = {

  // 이번 주 리포트 조회
  getWeeklyReport: () =>
    httpClient.get(`/report/weekly?t=${Date.now()}`, {
      headers: {
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    }),
  // 전체 리포트 히스토리 리스트 조회
  getHistory: () =>
    httpClient.get("/report/history"),


  // 단일 리포트 상세 조회 (GET /report/item/:id)
  getById: (id) => 
    httpClient.get(`/report/item/${id}`),

  // 리포트 생성 요청 (POST /report/generate)
  generateReport: (date) => 
    httpClient.post("/report/generate", { date }),
};
