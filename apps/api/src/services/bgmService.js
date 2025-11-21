// src/services/bgmService.js
import prisma from "../lib/prisma.js";

/* ----------------------------------------
   특정 일기의 BGM 조회
----------------------------------------- */
export const getByDiary = (diaryId) => {
  return prisma.bGM.findMany({
    where: { diary_id: diaryId },
    include: {
      emotionResult: true,
      diary: true,
    },
  });
};

/* ----------------------------------------
   전체 BGM (유저 전체)
----------------------------------------- */
export const getAll = (userId) => {
  return prisma.bGM.findMany({
    where: { user_id: userId },
    orderBy: { created_date: "desc" },
  });
};

/* ----------------------------------------
   단일 BGM 조회
----------------------------------------- */
export const getById = (id) => {
  return prisma.bGM.findUnique({
    where: { bgm_id: id },
    include: {
      diary: true,
      emotionResult: true,
    },
  });
};

/* ----------------------------------------
   생성 (workflow에서 사용)
----------------------------------------- */
export const create = (data) => {
  return prisma.bGM.create({ data });
};
