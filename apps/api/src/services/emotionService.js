import prisma from "../lib/prisma.js";

// AI 서버 주소
const AI_BASE_URL = process.env.AI_BASE_URL || "http://127.0.0.1:8000";

/* ----------------------------------------------------
   1. 오늘의 감정 예측 조회 (DB - Prisma 사용)
---------------------------------------------------- */
export const getTodayPrediction = async (userId) => {
  console.log(`🔎 [Service] User ${userId}의 예측 데이터 조회 시작 (날짜 제한 없음)...`);

  // 🚨 [수정] 날짜 범위 계산 로직 제거! (타임존 문제 해결될 때까지 무시)
  
  // DB에서 조회 (무조건 해당 유저의 가장 최신 데이터 1개)
  const prediction = await prisma.emotionPrediction.findFirst({
    where: {
      user_id: Number(userId),
      // created_date 조건 삭제함 -> 날짜 상관없이 가져옴
    },
    orderBy: { created_date: 'desc' } // 가장 최근에 생성된 것
  });

  if (!prediction) {
    console.log("❌ [Service] 데이터가 아예 없음");
    return null; 
  }

  // 3. 감정 숫자 -> 텍스트 변환
  const emotionMap = {
    0: "분노/불쾌 😡",
    1: "기쁨/행복 😄",
    2: "평온/무난 🙂",
    3: "슬픔/우울 😢",
    4: "불안/놀람 😨"
  };

  const emotionText = emotionMap[prediction.predicted_emotion] ?? "평온/무난 🙂";

  console.log(`✅ [Service] 데이터 리턴: ${emotionText} (작성일: ${prediction.created_date})`);

  return {
    exists: true,
    emotion_id: prediction.predicted_emotion,
    text: emotionText,
    created_at: prediction.created_date
  };
};

/* ----------------------------------------------------
   2. 텍스트 감정 분석 (AI 서버 직접 호출)
---------------------------------------------------- */
export const analyzeEmotion = async (text) => {
  if (!text) return { emotion: "Neutral" };

  try {
    console.log(`📡 [Service] AI 서버로 분석 요청: ${AI_BASE_URL}/emotion/analyze`);
    
    const response = await fetch(`${AI_BASE_URL}/emotion/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
        console.error("AI Server Error:", response.status);
        return { emotion: "Neutral" };
    }

    const data = await response.json();
    return data; 
  } catch (err) {
    console.error("❌ [Service] AI 분석 실패:", err);
    return { emotion: "Neutral" }; 
  }
};