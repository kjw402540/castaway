import prisma from "../lib/prisma.js";

// 환경 변수 (8000번 포트 하나만 사용)
//const AI_BASE_URL = process.env.AI_BASE_URL
//const AI_BASE_URL = "http://172.31.19.26:8000";
const AI_BASE_URL = "http://127.0.0.1:8000";

/**
 * 🔢 [Helper] 감정 라벨(String) -> DB 코드(Int) 변환
 */
function mapEmotionToInt(label) {
  if (!label) return 2; // 기본값: 중립
  const lowerLabel = label.toLowerCase();

  if (lowerLabel.includes("anger") || lowerLabel.includes("disgust")) return 0;
  if (lowerLabel.includes("joy") || lowerLabel.includes("happy")) return 1;
  if (lowerLabel.includes("neutral")) return 2;
  if (lowerLabel.includes("sad")) return 3;
  if (lowerLabel.includes("surprise") || lowerLabel.includes("fear")) return 4;

  return 2; 
}

/**
 * 🧮 [Helper] Softmax 배열에서 최대값(Score) 추출
 */
function getMaxScore(softmaxArray) {
  if (!softmaxArray || !Array.isArray(softmaxArray) || softmaxArray.length === 0) {
    return 1.0; 
  }
  return Math.max(...softmaxArray);
}

/**
 * 🚀 [AI Workflow] 전체 프로세스 실행
 * 1. 감정 분석 요청
 * 2. EmotionResult 저장 (emotion_id 획득)
 * 3. (보류) BGM 생성 요청
 * 4. (보류) BGM 테이블에 저장 
 * 5. EmotionPrediction 테이블 업데이트 (실제 감정 동기화)
 */
export const runFullAnalysisWorkflow = async (diaryId, text) => {
  console.log(`🚀 [AI Workflow] 시작 (Diary ID: ${diaryId})`);

  try {
    // =========================================================
    // STEP 0: 작성자(User ID) 조회 (나중에 BGM 및 Prediction 동기화용)
    // =========================================================
    const currentDiary = await prisma.diary.findUnique({
      where: { diary_id: Number(diaryId) },
      select: { user_id: true } 
    });

    if (!currentDiary) {
      throw new Error(`일기를 찾을 수 없습니다. ID: ${diaryId}`);
    }
    const userId = currentDiary.user_id;


    // =========================================================
    // STEP 1: 감정 분석 & 원인 추출 요청
    // =========================================================
    console.log(`📡 [Step 1] 감정 분석 요청...`);
    
    const analyzeResponse = await fetch(`${AI_BASE_URL}/emotion/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text }),
    });

    if (!analyzeResponse.ok) throw new Error(`감정 분석 API 실패`);

    const analyzeResult = await analyzeResponse.json();
    console.log(`✅ [Step 1] 분석 완료: ${analyzeResult.emotion_label}`);


    // =========================================================
    // STEP 2: EmotionResult 저장 -> ★Diary 테이블 업데이트★
    // =========================================================
    const emotionInt = mapEmotionToInt(analyzeResult.emotion_label);

    // 1) EmotionResult 생성
    const savedEmotion = await prisma.emotionResult.create({
      data: {
        diary_id: Number(diaryId),
        summary_text: analyzeResult.cause_sentence || "",
        main_emotion: emotionInt,
        keyword_1: analyzeResult.cause_keywords?.[0] || null,
        keyword_2: analyzeResult.cause_keywords?.[1] || null,
        keyword_3: analyzeResult.cause_keywords?.[2] || null,
      },
    });
    
    const newEmotionId = savedEmotion.emotion_id;
    console.log(`💾 [Step 2-1] EmotionResult 생성 완료 (ID: ${newEmotionId})`);

    // 2) ✅ [추가된 핵심 로직] Diary 테이블에 emotion_id 업데이트!
    await prisma.diary.update({
      where: { diary_id: Number(diaryId) },
      data: {
        emotion_id: newEmotionId, 
      },
    });
    console.log(`🔗 [Step 2-2] Diary 테이블 연결 완료 (emotion_id 업데이트)`);


    /* // =========================================================
    // 🚧 [보류] STEP 3: BGM 생성 요청
    // =========================================================
    console.log(`🎵 [Step 3] BGM 생성 요청...`);

    const score = getMaxScore(analyzeResult.emotion_softmax);

    const bgmResponse = await fetch(`${AI_BASE_URL}/bgm/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emotion: emotionInt,
        score: score,
        diary_id: Number(diaryId)
      }),
    });

    if (!bgmResponse.ok) throw new Error(`BGM 생성 API 실패`);

    const bgmResult = await bgmResponse.json();
    console.log(`✅ [Step 3] BGM 생성 완료`);


    // =========================================================
    // 🚧 [보류] STEP 4: BGM 테이블에 저장
    // =========================================================
    await prisma.bGM.create({
      data: {
        user_id: userId,       
        emotion_id: emotionId, 
        diary_id: Number(diaryId),
        bgm_url: bgmResult.filePath,
      },
    });
    console.log(`✅ [Step 4] BGM 테이블 저장 완료`);
    */


    // =========================================================
    // STEP 5: EmotionPrediction 테이블 동기화 (LSTM용)
    // =========================================================
    // 오늘 날짜에 대해 이미 생성된 예측 row가 있다면, 진짜 감정(main_emotion)을 업데이트
    // const todayStart = new Date();
    // todayStart.setHours(0,0,0,0);
    // const todayEnd = new Date();
    // todayEnd.setHours(23,59,59,999);

    // // 1. 오늘자 예측 데이터 찾기
    // const todayPrediction = await prisma.emotionPrediction.findFirst({
    //   where: {
    //     user_id: userId, 
    //     created_date: { gte: todayStart, lte: todayEnd }
    //   }
    // });

    // // 2. 있으면 main_emotion 업데이트 (실제 일기 감정 반영)
    // if (todayPrediction) {
    //   await prisma.emotionPrediction.update({
    //     where: { prediction_id: todayPrediction.prediction_id },
    //     data: {
    //       main_emotion: emotionInt // 아까 분석한 진짜 감정값
    //     }
    //   });
    //   console.log(`🔄 [Sync] EmotionPrediction 테이블에 실제 감정(${emotionInt}) 업데이트 완료`);
    // } else {
    //    console.log(`ℹ️ [Sync] 오늘자 예측 데이터가 없어 동기화 패스 (가입 초기 등)`);
    // }

    console.log(`🏁 [AI Workflow] 모든 작업 최종 완료!`);
    return analyzeResult.emotion_label; 

  } catch (error) {
    console.error(`❌ [AI Workflow] 에러 발생:`, error.message);
  }
};