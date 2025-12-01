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
