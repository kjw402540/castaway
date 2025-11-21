// src/services/diaryService.js
import prisma from "../lib/prisma.js";
import { toKST } from "../utils/date.js";

/* ---------------------------------------------
   Validation
---------------------------------------------- */
function validateDiary(data) {
  if (!data.user_id) throw new Error("user_id는 필수입니다.");
  if (!data.original_text) throw new Error("original_text는 필수입니다.");

  const allowedInput = ["text", "voice"];
  if (data.input_type && !allowedInput.includes(data.input_type)) {
    throw new Error("input_type은 text/voice 중 하나여야 합니다.");
  }
}

/* ---------------------------------------------
   하루 1일기 Upsert
---------------------------------------------- */
export const save = async (data) => {
  validateDiary(data);

  const diaryDate = data.date ? toKST(data.date) : new Date();

  // 기존 일기 조회
  const existing = await prisma.diary.findFirst({
    where: {
      user_id: data.user_id,
      created_date: {
        gte: diaryDate,
        lt: new Date(diaryDate.getTime() + 24 * 60 * 60 * 1000),
      },
    },
  });

  // 존재하면 업데이트
  if (existing) {
    return prisma.diary.update({
      where: { diary_id: existing.diary_id },
      data: {
        original_text: data.original_text,
        input_type: data.input_type || "text",
        flag: "updated",
      },
    });
  }

  // 신규 생성
  // 신규 생성
  return prisma.diary.create({
    data: {
      user_id: data.user_id,
      original_text: data.original_text,
      created_date: diaryDate, // YYYY-MM-DD 00:00:00
      input_type: data.input_type || "text",
      flag: data.flag || "normal",

      // ★ emotion_id는 처음 저장 시 null이어야 한다
      emotion_id: null,

      // ★ object_id도 아직 null
      object_id: null
    },
  });



};

/* ---------------------------------------------
   날짜별 일기 조회
---------------------------------------------- */
export const getByDate = async (userId, ymd) => {
  const target = toKST(ymd);

  return prisma.diary.findFirst({
    where: {
      user_id: userId,
      created_date: {
        gte: target,
        lt: new Date(target.getTime() + 24 * 60 * 60 * 1000),
      },
    },
    include: {
      emotionResult: true,
      object: true,
      bgms: true,
    },
  });
};

/* ---------------------------------------------
   전체 일기 조회
---------------------------------------------- */
export const getAll = (userId) => {
  return prisma.diary.findMany({
    where: { user_id: userId },
    orderBy: { created_date: "desc" },
  });
};

/* ---------------------------------------------
   일기 삭제 (그날 세트 삭제)
---------------------------------------------- */
export const remove = async (userId, date) => {
  const target = toKST(date);

  return prisma.diary.deleteMany({
    where: {
      user_id: userId,
      created_date: {
        gte: target,
        lt: new Date(target.getTime() + 24 * 60 * 60 * 1000),
      },
    },
  });
};
