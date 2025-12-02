// --------------------------------------------------------
// apps/api/src/services/notificationService.js (BACK)
// DB Notification CRUD
// --------------------------------------------------------

import prisma from "../lib/prisma.js";

// 전체 조회
export const getList = (userId) => {
  return prisma.notification.findMany({
    where: { user_id: Number(userId) },
    orderBy: { created_date: "desc" },
  });
};

// 단일 조회
export const getById = (id) => {
  return prisma.notification.findUnique({
    where: { notify_id: Number(id) },
  });
};

// 생성
export const create = (data) => {
  if (!data.user_id) throw new Error("user_id required");
  if (!data.title) throw new Error("title required");

  return prisma.notification.create({
    data: {
      user_id: Number(data.user_id),
      title: data.title,
      message: data.message ?? "",
      type: Number(data.type ?? 2),
      is_read: false,
    },
  });
};

// 읽음 처리
export const markAsRead = (id) => {
  return prisma.notification.update({
    where: { notify_id: Number(id) },
    data: { is_read: true },
  });
};

// 선택/전체 삭제
export const removeMany = (ids, userId) => {
  return prisma.notification.deleteMany({
    where:
      ids === "all"
        ? { user_id: Number(userId) }
        : { notify_id: { in: ids.map(Number) } },
  });
};

// 단일 삭제
export const remove = (id) => {
  return prisma.notification.delete({
    where: { notify_id: Number(id) },
  });
};
