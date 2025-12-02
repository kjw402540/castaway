// src/services/notificationService.js

import prisma from "../lib/prisma.js";

/**
 * 전체 조회 (Mail 포함)
 * ?type=3 -> Mail만 필터링
 */
export async function getList(userId, type = null, limit = 30) {
  return prisma.notification.findMany({
    where: {
      user_id: Number(userId),
      ...(type !== null ? { type: Number(type) } : {})
    },
    orderBy: { created_date: "desc" },
    take: limit,
  });
}

/** 단일 조회 */
export async function getById(id) {
  return prisma.notification.findUnique({
    where: { notify_id: Number(id) }
  });
}

/** 생성 */
export async function create(data) {
  return prisma.notification.create({
    data: {
      user_id: Number(data.user_id),
      title: data.title ?? "알림",
      message: data.message ?? "",
      type: data.type ?? 0,
    },
  });
}

/** 읽음 처리 */
export async function markAsRead(id) {
  return prisma.notification.update({
    where: { notify_id: Number(id) },
    data: { is_read: true },
  });
}

/** 삭제 */
export async function remove(id) {
  return prisma.notification.delete({
    where: { notify_id: Number(id) }
  });
}
