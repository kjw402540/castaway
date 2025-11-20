import prisma from "../lib/prisma.js";

export async function getByDiary(diary_id) {
  return prisma.bGM.findMany({
    where: { diary_id: Number(diary_id) },
    orderBy: { created_date: "desc" },
  });
}
