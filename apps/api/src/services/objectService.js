// src/services/objectService.js
import prisma from "../lib/prisma.js";
import { toKST } from "../utils/date.js";

/* ----------------------------------------
   날짜별 오브제 조회
----------------------------------------- */
export const getByDate = async (userId, ymd) => {
  const target = toKST(ymd);

  const obj = await prisma.object.findFirst({
    where: {
      user_id: userId,
      // ▼ [수정] 연결된 다이어리가 '삭제되지 않은(flag=1)' 상태여야 함
      Diary: {
        flag: 1, 
      },
      created_date: {
        gte: target,
        lt: new Date(target.getTime() + 24 * 60 * 60 * 1000),
      },
    },
    include: {
      EmotionResult: true, 
      Diary: true,         
    },
  });

  if (!obj) return null;

  return {
    ...obj,
    emotion: obj.EmotionResult,
    diary: obj.Diary
  };
};

/* ----------------------------------------
   전체 조회 (여기가 오브제 화면 목록)
----------------------------------------- */
export const getAll = async (userId) => {
  const objects = await prisma.object.findMany({
    where: { 
      user_id: userId,
      // ▼ [수정] 여기서도 Diary의 flag가 1인 것만 필터링!
      Diary: {
        flag: 1,
      }
    },
    orderBy: { created_date: "desc" },
    include: {
      EmotionResult: true, 
      Diary: true,
    },
  });

  return objects.map((obj) => ({
    ...obj,
    emotion: obj.EmotionResult, 
    diary: obj.Diary
  }));
};

/* ----------------------------------------
   단일 조회
----------------------------------------- */
export const getById = async (id) => {
  const obj = await prisma.object.findUnique({
    where: { object_id: Number(id) },
    include: {
      EmotionResult: true,
      Diary: true,
    },
  });

  if (!obj) return null;
  
  // (선택사항) 단일 조회 시에도 삭제된 건 안 보여주려면 아래 로직 추가
  // if (obj.Diary && obj.Diary.flag === 0) return null;

  return {
    ...obj,
    emotion: obj.EmotionResult,
    diary: obj.Diary
  };
};

/* ----------------------------------------
   생성
----------------------------------------- */
export const create = (data) => {
  return prisma.object.create({ data });
};