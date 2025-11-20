// src/services/reportService.js
import { USE_API } from "../config/apiConfig";
import { reportApi } from "../api/reportApi";
import { reportMock } from "../mocks/reportMock";

export const getWeeklyReport = () =>
  USE_API ? reportApi.getWeeklyReport() : reportMock.getWeeklyReport();

export const getHistoryReports = () =>
  USE_API ? reportApi.getHistory() : reportMock.getHistory();

export const saveReport = (data) =>
  USE_API ? reportApi.saveReport(data) : reportMock.saveReport(data);
