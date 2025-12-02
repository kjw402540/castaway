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

// src/services/notificationService.js

import { notificationApi } from "../api/notificationApi";

// 동일 파일 내부에서 바로 사용
const NotificationType = {
  SYSTEM: 0,
  OBJECT: 1,
  REPORT: 2,
  MAIL: 3,
};

let listeners = new Set();
function notifyUpdate() {
  listeners.forEach((fn) => fn());
}

export function subscribeNotificationUpdate(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Mail 목록 */
export async function fetchMailList() {
  const list = await notificationApi.getAll(NotificationType.MAIL);

  return list.map((noti) => ({
    id: noti.notify_id,
    title: noti.title,
    content: noti.message,
    date: noti.created_date,
    read: noti.is_read,
  }));
}

export async function fetchMailDetail(id) {
  const noti = await notificationApi.getById(id);

  return {
    id: noti.notify_id,
    title: noti.title,
    content: noti.message,
    date: noti.created_date,
    read: noti.is_read,
  };
}

export async function markMailAsRead(id) {
  await notificationApi.markAsRead(id);
  notifyUpdate();
}

export async function deleteMail(id) {
  await notificationApi.delete(id);
  notifyUpdate();
}
