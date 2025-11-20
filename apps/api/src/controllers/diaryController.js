import prisma from "../lib/prisma.js";

// 전체 일기 조회
export const getAll = async (req, res) => {
  try {
    const diaries = await prisma.diary.findMany();
    res.json(diaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 특정 날짜 일기 조회
export const getByDate = async (req, res) => {
  const { date } = req.params;
  try {
    const diary = await prisma.diary.findFirst({
      where: { created_date: date },
    });
    res.json(diary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 일기 저장
export const save = async (req, res) => {
  const data = req.body;
  try {
    const newDiary = await prisma.diary.create({ data });
    res.json(newDiary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 특정 날짜 일기 삭제
export const remove = async (req, res) => {
  const { date } = req.params;
  try {
    const deleted = await prisma.diary.deleteMany({
      where: { created_date: date },
    });
    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
