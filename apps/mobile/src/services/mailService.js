// src/services/mailService.js
import { mailMock } from "../mocks/mailMock";
import { notificationApi } from "../api/notificationApi";

// 이제 API 사용 안 함 → 모든 Mail은 로컬 mock 기반
export const getAllMail = () => mailMock.getAll();
export const addMail = (mail) => {
  const result = mailMock.add(mail);
  notifyMailUpdate();
  return result;
};
export const markAsRead = (id) => {
  const result = mailMock.markAsRead(id);
  notifyMailUpdate();
  return result;
};
export const deleteMail = (ids) => {
  const result = mailMock.delete(ids);
  notifyMailUpdate();
  return result;
};

// ---- 전역 업데이트 이벤트 시스템 ----
let mailListeners = new Set();
export function subscribeMailUpdate(fn) {
  mailListeners.add(fn);
  return () => mailListeners.delete(fn);
}
function notifyMailUpdate() {
  mailListeners.forEach((fn) => fn());
}

export async function syncNotificationToMail() {
  const notifications = await notificationApi.getAll();

  notifications.forEach((n) => {
    addMail({
      id: `noti-${n.notification_id}`,
      title: n.message,
      content: n.message,
      date: new Date().toISOString(),
      read: false,
    });
  });
}