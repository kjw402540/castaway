// src/services/notificationService.js
import prisma from "../lib/prisma.js";

/* 최신 알림 조회 */
export const getByUser = (userId, limit = 30) => {
  return prisma.notification.findMany({
    where: { user_id: Number(userId) },
    orderBy: { notify_time: "desc" },
    take: limit,
  });
};

/* 단일 조회 */
export const getById = (id) => {
  return prisma.notification.findUnique({
    where: { notify_id: Number(id) },
  });
};

/* 생성 */
export const create = (data) => {
  if (!data.user_id) throw new Error("user_id는 필수입니다.");
  if (!data.message) throw new Error("message는 필수입니다.");

  return prisma.notification.create({
    data: {
      user_id: Number(data.user_id),
      message: data.message,
      type: normalizeType(data.type), // INT
    },
  });
};

/* 삭제 */
export const remove = (id) => {
  return prisma.notification.delete({
    where: { notify_id: Number(id) },
  });
};

/* INT 타입으로 normalize */
function normalizeType(type) {
  const map = {
    report: 0,
    object: 1,
    alert: 2,
    system: 2,
    0: 0,
    1: 1,
    2: 2,
  };

  return map[type] ?? 2;
}
