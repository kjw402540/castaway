import prisma from "../lib/prisma.js";
import { toKST } from "../utils/date.js";

// 날짜별 오브제
export const getByDate = async (userId, ymd) => {
  const target = toKST(ymd);

  return prisma.object.findFirst({
    where: {
      user_id: userId,
      created_date: {
        gte: target,
        lt: new Date(target.getTime() + 24 * 60 * 60 * 1000),
      },
    },
    include: {
      emotionResult: true,
      diary: true,
    },
  });
};

// 전체
export const getAll = (userId) => {
  return prisma.object.findMany({
    where: { user_id: userId },
    orderBy: { created_date: "desc" },
  });
};

// 단일 조회
export const getById = (id) => {
  return prisma.object.findUnique({
    where: { object_id: id },
    include: {
      emotionResult: true,
      diary: true,
    },
  });
};

// 생성 (workflow에서 사용)
export const create = (data) => {
  return prisma.object.create({ data });
};
