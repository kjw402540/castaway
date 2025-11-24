// src/services/diaryService.js
import prisma from "../lib/prisma.js";

export const getAll = (userId) => {
  return prisma.diary.findMany({
    where: { user_id: userId },
    orderBy: { created_date: "desc" },
    include: {
      emotionResult: true,
      Object: true,
      bgms: true,
    }
  });
};

export const getByDate = async (userId, ymd) => {
  const date = new Date(`${ymd}T00:00:00`);
  const next = new Date(`${ymd}T23:59:59`);

  return prisma.diary.findFirst({
    where: {
      user_id: userId,
      created_date: {
        gte: date,
        lte: next,
      },
    },
    include: {
      emotionResult: true,
      Object: true,
      bgms: true,
    }
  });
};

export const create = async (data) => {
  if (!data.original_text) throw new Error("original_text는 필수");

  return prisma.diary.create({
    data: {
      user_id: data.user_id,
      original_text: data.original_text,
      input_type: data.input_type ?? "text",
      flag: data.flag ?? "normal",
      created_date: new Date(),
      emotion_id: data.emotion_id,   // 이후 워크플로우에서 채움
      object_id: null,
    }
  });
};

export const remove = async (userId, ymd) => {
  const date = new Date(`${ymd}T00:00:00`);
  const next = new Date(`${ymd}T23:59:59`);

  return prisma.diary.deleteMany({
    where: {
      user_id: userId,
      created_date: {
        gte: date,
        lte: next,
      }
    }
  });
};
