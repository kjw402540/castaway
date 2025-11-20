// src/api/reportApi.js
import { httpClient } from "./client";

export const reportApi = {
  getWeeklyReport: () => httpClient.get("/report/weekly"),

  getHistory: () => httpClient.get("/report/history"),

  saveReport: (data) => httpClient.post("/report", data),
};
