// --------------------------------------------------------
// src/services/notificationService.js (FRONT)
// DB Notification 연동 Wrapper
// --------------------------------------------------------

import { notificationApi } from "../api/notificationApi";

// 서버 응답이 res.data / res.data.data 어떤 구조여도 안전하게 처리
function extractList(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.data)) return res.data.data;
  return [];
}

// 전체 조회
export async function getAllNotification() {
  const res = await notificationApi.getAll();
  return extractList(res);
}

// 단일 조회
export async function getNotificationDetail(id) {
  const res = await notificationApi.getById(id);
  return res.data?.data ?? res.data;
}

// 읽음 처리
export async function markNotificationAsRead(id) {
  const res = await notificationApi.markAsRead(id);
  return res.data?.data ?? res.data;
}

// 단일 삭제
export async function deleteNotification(id) {
  const res = await notificationApi.delete(id);
  return res.data?.data ?? res.data;
}

// 전체삭제 (필요하면 래퍼 제공)
export async function deleteAllNotifications() {
  const res = await notificationApi.delete("all");
  return res.data?.data ?? res.data;
}
