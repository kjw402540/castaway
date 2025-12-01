// src/services/emotionPredictJob.js

import cron from "node-cron";
import prisma from "../lib/prisma.js";

// 환경변수에서 AI URL 가져오기 (없으면 로컬 기본값)
const AI_API_URL = process.env.AI_API_URL

// 날짜를 YYYY-MM-DD 포맷으로 변환하는 헬퍼
const toYMD = (date) => date.toISOString().split('T')[0];

/**
 * 🔢 [Helper] 감정 라벨(String/Int) -> DB 코드(Int) 변환
 * 0: 분노/혐오, 1: 기쁨, 2: 중립, 3: 슬픔, 4: 놀람/공포
 */
function mapEmotionToInt(label) {
  if (typeof label === 'number') return label;
  if (!label) return 2; // 기본값 중립

  const l = label.toLowerCase();
  if (l.includes("anger") || l.includes("disgust")) return 0;
  if (l.includes("joy") || l.includes("happy")) return 1;
  if (l.includes("neutral")) return 2;
  if (l.includes("sad")) return 3;
  if (l.includes("surprise") || l.includes("fear")) return 4;
  
  return 2;
}

/**
 * 🚀 스케줄러 시작 함수 (index.js에서 호출)
 * 매일 새벽 3시에 실행
 */
export const startEmotionPredictionJob = () => {
  // Cron 표현식: "초 분 시 일 월 요일" -> "0 3 * * *" (매일 03:00:00)
  cron.schedule("0 3 * * *", async () => {
    console.log("⏰ [Batch] 새벽 감정 예측 작업 시작 (LSTM)...");
    await runBatchPrediction();
  });
};

/**
 * 🏃‍♂️ 실제 배치 작업 로직
 */
const runBatchPrediction = async () => {
  try {
    const today = new Date();
    
    // 1. 가입한 지 14일 지난 유저 찾기
    const fourteenDaysAgo = new Date(today);
    fourteenDaysAgo.setDate(today.getDate() - 14);

    const targetUsers = await prisma.user.findMany({
      where: {
        created_date: { lte: fourteenDaysAgo }, // 가입일 <= 14일 전
        used_flag: 1 // 탈퇴 안 한 유저
      }
    });

    console.log(`👥 [Batch] 대상 유저 수: ${targetUsers.length}명`);

    // 각 유저별로 순차 처리 (Promise.all보다 DB 부하가 적음)
    for (const user of targetUsers) {
      await processUser(user);
    }

    console.log("✅ [Batch] 모든 유저 예측 작업 완료!");

  } catch (err) {
    console.error("❌ [Batch] 전체 작업 중 치명적 에러:", err);
  }
};

/**
 * 👤 개별 유저 데이터 수집 및 예측 요청
 */
const processUser = async (user) => {
  const userId = user.user_id;
  
  // AI 모델 입력용 리스트
  const emotionLabelList = [];
  const dayOfWeekList = [];
  const changeFlagList = [];

  let prevEmotion = -1; // 변화 감지용 (이전 감정)

  // 기준일: "어제" (새벽 3시에 돌리므로, 어제까지의 데이터를 모아서 '오늘'을 예측)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  try {
    // 14일 전 ~ 어제까지 루프 (과거 -> 최신 순서로 쌓음)
    for (let i = 13; i >= 0; i--) {
      const targetDate = new Date(yesterday);
      targetDate.setDate(yesterday.getDate() - i);
      const targetYMD = toYMD(targetDate);

      // 날짜 범위 설정 (00:00 ~ 23:59)
      const startOfDay = new Date(`${targetYMD}T00:00:00.000Z`);
      const endOfDay = new Date(`${targetYMD}T23:59:59.999Z`);

      // =========================================================
      // 🔍 Hybrid 데이터 조회 (우선순위 로직)
      // =========================================================
      
      // (1) EmotionPrediction 테이블을 먼저 조회
      // (이 테이블에는 '예측값'이 들어있지만, 사용자가 일기를 쓰면 'main_emotion'에 진짜가 업데이트됨)
      const history = await prisma.emotionPrediction.findFirst({
        where: {
          user_id: userId,
          created_date: { gte: startOfDay, lte: endOfDay }
        }
      });

      // (2) Diary 테이블 직접 조회 (혹시 EmotionPrediction 생성이 안 된 옛날 데이터일 수 있으니)
      const realDiary = await prisma.diary.findFirst({
        where: {
          user_id: userId,
          flag: 1, // 활성 일기
          created_date: { gte: startOfDay, lte: endOfDay }
        },
        include: { emotionResult: true }
      });

      let emotionVal = 2; // 기본값: Neutral

      // 로직: 진짜 일기(Diary)가 있으면 최우선 -> 그게 아니면 Prediction 테이블의 main -> predicted 순
      if (realDiary && realDiary.emotionResult) {
        // A. 진짜 일기 데이터가 존재함
        emotionVal = realDiary.emotionResult.main_emotion;
      } else if (history) {
        // B. 일기는 없지만, 예측 테이블 데이터가 있음
        if (history.main_emotion !== null) {
          emotionVal = history.main_emotion; // (일기를 썼다면 여기에 값이 있을 것)
        } else {
          emotionVal = history.predicted_emotion; // 일기 안 썼으면 과거에 예측했던 값 사용
        }
      } else {
        // C. 아무 데이터도 없음 (가입 초기 등) -> 중립
        emotionVal = 2;
      }

      // ---------------------------------------------------------
      // 📝 리스트 구성
      // ---------------------------------------------------------
      // 1. Emotion Label
      emotionLabelList.push(emotionVal);

      // 2. Day of Week (0:일요일 ~ 6:토요일)
      dayOfWeekList.push(targetDate.getDay());

      // 3. Change Flag (전날 대비 변화 여부)
      if (prevEmotion !== -1) {
        if (prevEmotion !== emotionVal) {
          changeFlagList.push(1.0); // 변함
        } else {
          changeFlagList.push(0.0); // 유지
        }
      } else {
        // 첫 번째 데이터는 비교 대상 없으므로 0.0
        changeFlagList.push(0.0);
      }
      prevEmotion = emotionVal;
    }

    // =========================================================
    // 📡 AI 서버 요청 (POST /emotion/predict)
    // =========================================================
    const payload = {
      emotion_label: emotionLabelList,
      day_of_week: dayOfWeekList,
      change_flag: changeFlagList,
      user_type: user.cluster_id || 0 // DB에 cluster_id 없으면 0
    };

    // console.log(`📡 [Batch] User ${userId} 요청 데이터:`, JSON.stringify(payload));

    const response = await fetch(`${AI_API_URL}/emotion/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`AI Request Failed: ${response.status}`);
    }

    const result = await response.json(); 
    // 예상 응답: { "predicted_emotion": "Happy", "emotion_softmax": [0.1, 0.8, ...] }

    // =========================================================
    // 💾 예측 결과 저장 (EmotionPrediction)
    // =========================================================
    
    // AI 응답이 문자열(예: "Happy")로 올 수도 있고 숫자(1)로 올 수도 있음
    const predInt = mapEmotionToInt(result.predicted_emotion);
    
    const today = new Date(); // 배치 도는 시점(오늘)에 대한 예측이므로 오늘 날짜 저장

    await prisma.emotionPrediction.create({
      data: {
        user_id: userId,
        target_date: today, // 오늘 날짜에 대한 예측
        predicted_emotion: predInt,
        // emotion_softmax가 배열로 오면 그대로 저장 (DB타입이 Json이어야 함)
        emotion_softmax: result.emotion_softmax || [], 
        main_emotion: null, // 아직 일기 안 썼으니 비워둠
      }
    });

    console.log(`🔮 [Batch] User ${userId} 예측 저장 완료: ${result.predicted_emotion} (${predInt})`);

  } catch (e) {
    console.error(`❌ [Batch] User ${userId} 실패:`, e.message);
  }
};