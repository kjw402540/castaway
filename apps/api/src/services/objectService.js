// apps/api/src/services/objectService.js
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
      created_date: {
        gte: target,
        lt: new Date(target.getTime() + 24 * 60 * 60 * 1000),
      },
    },
    include: {
      EmotionResult: true, // ⚠️ 스키마에 정의된 이름 (대문자)
      Diary: true,         // ⚠️ 스키마에 정의된 이름 (대문자 Diary)
    },
  });

  if (!obj) return null;

  // 프론트엔드 호환성을 위해 이름 매핑 (EmotionResult -> emotion)
  return {
    ...obj,
    emotion: obj.EmotionResult,
    diary: obj.Diary
  };
};

/* ----------------------------------------
   전체 조회 (여기가 가장 중요!)
----------------------------------------- */
export const getAll = async (userId) => {
  const objects = await prisma.object.findMany({
    where: { user_id: userId },
    orderBy: { created_date: "desc" },
    include: {
      EmotionResult: true, // ✅ 이게 있어야 프론트에서 그룹핑 가능
      Diary: true,
    },
  });

  // 프론트엔드는 'item.emotion'을 찾으므로 키 이름을 변경해서 리턴
  return objects.map((obj) => ({
    ...obj,
    emotion: obj.EmotionResult, // 대문자 결과를 소문자 키에 할당
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