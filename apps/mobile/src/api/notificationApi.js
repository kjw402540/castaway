// src/api/notificationApi.js
import { httpClient } from "./client";

export const notificationApi = {

  // 전체 알림 조회 (최근 30개)
  getAll: () =>
    httpClient.get("/notification"),

  // 단일 알림 조회
  getById: (id) =>
    httpClient.get(`/notification/${id}`),

  // 알림 삭제
  delete: (id) =>
    httpClient.delete(`/notification/${id}`),
};
