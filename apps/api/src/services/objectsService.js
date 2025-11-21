import prisma from "../lib/prisma.js";

export async function getAll() {
  return prisma.object.findMany({
    orderBy: { created_date: "desc" },
    include: {
      emotionResult: true,
      diary: true,
    },
  });
}

export async function getByDiaryId(diary_id) {
  return prisma.object.findUnique({
    where: { diary_id: Number(diary_id) },
    include: {
      emotionResult: true,
      diary: true,
    },
  });
}

export async function remove(object_id) {
  return prisma.object.delete({
    where: { object_id: Number(object_id) },
  });
}
