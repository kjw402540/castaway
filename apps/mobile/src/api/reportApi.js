// src/api/reportApi.js
import { httpClient } from "./client";

export const reportApi = {

  // 이번 주 리포트 조회
  getWeeklyReport: () =>
    httpClient.get("/report/weekly"),


  // 전체 리포트 히스토리 리스트 조회
  getHistory: () =>
    httpClient.get("/report/history"),


  // 단일 리포트 상세 조회
  getById: (id) =>
    httpClient.get(`/report/${id}`),


  // 리포트 생성 (AI 분석 결과 저장)
  saveReport: (data) =>
    httpClient.post("/report", data),
};
