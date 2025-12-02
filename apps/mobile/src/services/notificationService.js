// --------------------------------------------------------
// src/services/notificationService.js (FRONT)
// DB Notification 연동 Wrapper
// --------------------------------------------------------

import { notificationApi } from "../api/notificationApi";

// 전체 조회
export async function getAllNotification() {
  const list = await notificationApi.getAll();
  return list; // created_date, is_read 그대로 사용
}

// 단일 조회
export async function getNotificationDetail(id) {
  return notificationApi.getById(id);
}

// 읽음 처리
export async function markNotificationAsRead(id) {
  await notificationApi.markAsRead(id);
}

// 삭제
export async function deleteNotification(id) {
  await notificationApi.delete(id);
}
