// src/services/notificationService.js
// DB Notification CRUD 기능
import prisma from "../lib/prisma.js";

/* -------------------------------------------------------
   최신 알림 조회 (alias: id 적용)
-------------------------------------------------------- */
export const getByUser = (userId, limit = 30) => {
  return prisma.notification.findMany({
    where: { user_id: Number(userId) },
    orderBy: { created_date: "desc" },  // created_date 사용
    take: limit,
    select: {
      notify_id: true,
      title: true,
      message: true,
      type: true,
      is_read: true,
      created_date: true,
      user_id: true,
    },
  }).then(rows =>
    rows.map(n => ({
      ...n,
      id: n.notify_id, // 프론트 호환 alias
    }))
  );
};

/* -------------------------------------------------------
   단일 조회 (alias: id 적용)
-------------------------------------------------------- */
export const getById = (id) => {
  return prisma.notification.findUnique({
    where: { notify_id: Number(id) },
    select: {
      notify_id: true,
      title: true,
      message: true,
      type: true,
      is_read: true,
      created_date: true,
      user_id: true,
    },
  }).then(n =>
    n ? { ...n, id: n.notify_id } : null
  );
};

/* -------------------------------------------------------
   생성
   - title 필수
   - message 선택
   - type INT(0~2)
-------------------------------------------------------- */
export const create = (data) => {
  if (!data.user_id) throw new Error("user_id는 필수입니다.");
  if (!data.title) throw new Error("title은 필수입니다.");

  return prisma.notification.create({
    data: {
      user_id: Number(data.user_id),
      title: data.title,
      message: data.message ?? null,
      type: normalizeType(data.type),
      is_read: false,
    },
  });
}

/* -------------------------------------------------------
   읽음 처리
-------------------------------------------------------- */
export const markAsRead = (id) => {
  return prisma.notification.update({
    where: { notify_id: Number(id) },
    data: { is_read: true },
  });
};

/* -------------------------------------------------------
   여러 개 삭제 or 전체 삭제
-------------------------------------------------------- */
export const removeMany = async (ids, userId) => {
  if (ids === "all") {
    return prisma.notification.deleteMany({
      where: { user_id: Number(userId) },
    });
  }

  return prisma.notification.deleteMany({
    where: { notify_id: { in: ids.map(Number) } },
  });
};

/* -------------------------------------------------------
   단일 삭제
-------------------------------------------------------- */
export const remove = (id) => {
  return prisma.notification.delete({
    where: { notify_id: Number(id) },
    data: { is_read: true },
  });
};

/* -------------------------------------------------------
   INT 타입 normalize
   0: report / 1: object / 2: 일반
-------------------------------------------------------- */
function normalizeType(type) {
  const map = { report: 0, object: 1, alert: 2, system: 2, 0: 0, 1: 1, 2: 2 };
  return map[type] ?? 2;
}
