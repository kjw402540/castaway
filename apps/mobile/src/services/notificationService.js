// src/services/notificationService.js
import apiClient from "../api/client";

// [전체 알림 조회]
export async function getAllNotification() {
  try {
    const res = await apiClient.get("/notification");
    return res.data;
  } catch (err) {
    console.log("getAllNotification error:", err);
    return [];
  }
}

// [단일 알림 조회]
export async function getNotification(id) {
  try {
    const res = await apiClient.get(`/notification/${id}`);
    return res.data;
  } catch (err) {
    console.log("getNotification error:", err);
    return null;
  }
}

// [선택 삭제]
export async function deleteNotification(id) {
  try {
    const res = await apiClient.delete(`/notification/${id}`);
    return res.data;
  } catch (err) {
    console.log("deleteNotification error:", err);
    return null;
  }
}

// [읽음 처리]
export async function markNotificationAsRead(id) {
  try {
    const res = await apiClient.patch(`/notification/${id}/read`);
    return res.data;
  } catch (err) {
    console.log("markNotificationAsRead error:", err);
    return null;
  }
}
