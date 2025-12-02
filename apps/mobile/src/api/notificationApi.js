// --------------------------------------------------------
// src/api/notificationApi.js
// Notification 관련 API 클라이언트
// --------------------------------------------------------

import { httpClient } from "./client";

// 전체 알림 조회
export const notificationApi = {
  getAll: () => httpClient.get(`/notification`),

  // 단일 조회
  getById: (id) => httpClient.get(`/notification/${id}`),

  // 생성
  create: (payload) => httpClient.post(`/notification`, payload),

  // 읽음 처리
  markAsRead: (id) => httpClient.patch(`/notification/${id}/read`),

  // 단일 삭제
  delete: (id) => httpClient.delete(`/notification/${id}`),
};
