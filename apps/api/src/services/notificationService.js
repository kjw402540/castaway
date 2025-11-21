// src/services/notificationService.js
import prisma from "../lib/prisma.js";

// 최신 알림 N개
export const getByUser = (userId, limit = 30) => {
  return prisma.notification.findMany({
    where: { user_id: userId },
    orderBy: { notify_time: "desc" },
    take: limit,
  });
};

// 단일 조회
export const getById = (id) => {
  return prisma.notification.findUnique({
    where: { notify_id: id },
  });
};

// 생성 (workflow 사용)
export const create = (data) => {
  return prisma.notification.create({
    data,
  });
};

// 삭제
export const remove = (id) => {
  return prisma.notification.delete({
    where: { notify_id: id },
  });
};
