import prisma from "../lib/prisma.js";

/* ==========================================
   전체 조회
========================================== */
export async function getAll() {
  return prisma.diary.findMany({
    orderBy: { created_date: "desc" },
    include: {
      emotionResult: true,
      object: true,
      bgms: true,
    },
  });
}

/* ==========================================
   날짜별 조회
========================================== */
export async function getByDate(date) {
  return prisma.diary.findFirst({
    where: {
      created_date: {
        gte: new Date(date),
        lt: new Date(date + "T23:59:59"),
      },
    },
    include: {
      emotionResult: true,
      object: true,
      bgms: true,
    },
  });
}

/* ==========================================
   삭제
========================================== */
export async function deleteDiary(date) {
  return prisma.diary.deleteMany({
    where: {
      created_date: {
        gte: new Date(date),
        lt: new Date(date + "T23:59:59"),
      },
    },
  });
}

/* ==========================================
   생성 (Diary + EmotionResult)
   ※ 스키마 요구 방식: 두 단계 저장
========================================== */
export async function createDiary({
  user_id,
  text,
  input_type,
  flag,
  analysis,
  embedding,
}) {
  // 1) Diary 생성 (emotion_id 없이)
  const diary = await prisma.diary.create({
    data: {
      user_id,
      original_text: text,
      input_type,
      flag,
      created_date: new Date(),
      emotion_id: 0, // 임시 placeholder (prisma는 null 불가)
    },
  });

  // 2) EmotionResult 생성 (diary_id 입력 필수)
  const emotionResult = await prisma.emotionResult.create({
    data: {
      diary_id: diary.diary_id,
      summary_text: analysis.summary,
      main_emotion: analysis.emotion,
      keyword_1: analysis.keywords[0] || null,
      keyword_2: analysis.keywords[1] || null,
      keyword_3: analysis.keywords[2] || null,
      embedding,
    },
  });

  // 3) Diary와 EmotionResult 연결 (emotion_id 업데이트)
  const updatedDiary = await prisma.diary.update({
    where: { diary_id: diary.diary_id },
    data: {
      emotion_id: emotionResult.emotion_id,
    },
    include: {
      emotionResult: true,
    },
  });

  return updatedDiary;
}
