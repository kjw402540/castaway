import prisma from "../lib/prisma.js";

/* ----------------------------------------------------
   모든 일기 조회 (리스트)
---------------------------------------------------- */
export const getAll = async (userId) => {
  return await prisma.diary.findMany({
    where: {
      user_id: Number(userId),
      flag: 1,                 
    },
    orderBy: { created_date: "desc" },
    include: {
      // emotionResult: true, // 스키마 필드명 확인 필요 (emotion_result? emotionResult?)
      // Object: true,     // ⚠️ Prisma 관계 필드명은 보통 소문자(object)입니다.
      // bgms: true,
    }
  });
};

/* ----------------------------------------------------
   날짜별 일기 조회 (상세)
---------------------------------------------------- */
export const getByDate = async (userId, ymd) => {
  // 날짜 범위 설정 (00:00:00 ~ 23:59:59.999)
  const startDate = new Date(`${ymd}T00:00:00.000Z`); 
  const endDate = new Date(`${ymd}T23:59:59.999Z`);

  return await prisma.diary.findFirst({
    where: {
      user_id: Number(userId), 
      flag: 1,                // 활성화된 일기만
      
      created_date: {
        gte: new Date(`${ymd}T00:00:00`), 
        lte: new Date(`${ymd}T23:59:59`), 
      },
    },
    include: {
      // emotionResult: true,
      // Object: true, // ⚠️ 대문자 Object가 맞는지 schema.prisma 확인 필수!
      // bgms: true,
    }
  });
};

/* ----------------------------------------------------
   일기 작성
---------------------------------------------------- */
export const create = async (userId, data) => {
  if (!data.original_text) throw new Error("original_text는 필수");

  let inputTypeInt = 1; 
  if (data.input_type === "audio") inputTypeInt = 0;

  // 1. 프론트에서 받은 날짜 문자열 (예: "2025-11-25")
  const targetDateStr = data.date || new Date().toISOString().split('T')[0];
  const startOfDay = new Date(`${targetDateStr}T00:00:00.000Z`);
  const endOfDay = new Date(`${targetDateStr}T23:59:59.999Z`);

  const now = new Date(); 
  const createdDate = new Date(targetDateStr); 
  
  createdDate.setHours(now.getHours());
  createdDate.setMinutes(now.getMinutes());
  createdDate.setSeconds(now.getSeconds());
  createdDate.setMilliseconds(now.getMilliseconds());

  return await prisma.$transaction(async (tx) => {
    
    // (A) 기존 활성 일기 비활성화 (0)
    await tx.diary.updateMany({
      where: {
        user_id: Number(userId),
        flag: 1, 
        created_date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      data: { flag: 0 },
    });

    // (B) 새 일기 저장 (flag: 1, 시간 포함된 createdDate 사용)
    const newDiary = await tx.diary.create({
      data: {
        user_id: Number(userId),
        original_text: data.text,
        input_type: inputTypeInt,
        flag: 1, 
        created_date: createdDate, 
        
        emotion_id: null,
        object_id: null,
      },
    });

    return newDiary;
  });
};

/* ----------------------------------------------------
   일기 삭제 (Soft Delete 권장하지만 일단 코드대로)
---------------------------------------------------- */
export const remove = async (userId, ymd) => {
  const date = new Date(`${ymd}T00:00:00`);
  const next = new Date(`${ymd}T23:59:59`);

  return await prisma.diary.deleteMany({
    where: {
      user_id: Number(userId),
      created_date: {
        gte: date,
        lte: next,
      }
    }
  });
};