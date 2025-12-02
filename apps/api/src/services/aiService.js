// --------------------------------------------------------
// apps/api/src/services/aiService.js
// Emotion + Notification 통합 Workflow
// --------------------------------------------------------

import prisma from "../lib/prisma.js";
import * as notificationService from "./notificationService.js";

// 환경 변수 (8000번 포트 하나만 사용)
// const AI_BASE_URL = process.env.AI_BASE_URL;
// const AI_BASE_URL = "http://172.31.19.26:8000";
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
 * 🚀 [AI Workflow] 전체 프로세스 실행
 * 1) 감정 분석 요청
 * 2) EmotionResult 저장 (emotion_id 획득)
 * 3) Diary 테이블 emotion_id 업데이트
 * 4) Notification 생성
 */
export const runFullAnalysisWorkflow = async (diaryId, text) => {
  console.log(`🚀 [AI Workflow] 시작 (Diary ID: ${diaryId})`);

  try {
    // =========================================================
    // STEP 0: 작성자(User ID) 조회
    // =========================================================
    const currentDiary = await prisma.diary.findUnique({
      where: { diary_id: Number(diaryId) },
      select: { user_id: true },
    });

    if (!currentDiary) {
      throw new Error(`일기를 찾을 수 없습니다. diary_id=${diaryId}`);
    }
    const userId = currentDiary.user_id;

    console.log(`📡 [Step 1] 감정 분석 요청...`);

    // =========================================================
    // STEP 1: 감정 분석 요청
    // =========================================================
    const analyzeResponse = await fetch(`${AI_BASE_URL}/emotion/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!analyzeResponse.ok) throw new Error("감정 분석 API 실패");

    const analyzeResult = await analyzeResponse.json();
    console.log(`✅ [Step 1] 분석 완료: ${analyzeResult.emotion_label}`);

    const emotionInt = mapEmotionToInt(analyzeResult.emotion_label);

    // =========================================================
    // STEP 2: EmotionResult DB 저장
    // =========================================================
    const savedEmotion = await prisma.emotionResult.create({
      data: {
        diary_id: Number(diaryId),
        summary_text: analyzeResult.cause_sentence ?? "",
        main_emotion: emotionInt,
        keyword_1: analyzeResult.cause_keywords?.[0] ?? null,
        keyword_2: analyzeResult.cause_keywords?.[1] ?? null,
        keyword_3: analyzeResult.cause_keywords?.[2] ?? null,
      },
    });

    console.log(
      `💾 [Step 2] EmotionResult 저장 완료 (ID: ${savedEmotion.emotion_id})`
    );

    // =========================================================
    // STEP 3: Diary 테이블 emotion_id 업데이트
    // =========================================================
    await prisma.diary.update({
      where: { diary_id: Number(diaryId) },
      data: { emotion_id: savedEmotion.emotion_id },
    });

    console.log(`🔗 [Step 3] Diary 연결 완료`);

    // =========================================================
    // STEP 4: Notification 생성
    // =========================================================
    const emotionLabelKor =
      ["분노/혐오", "기쁨", "중립", "슬픔", "놀람/공포"][emotionInt] ?? "감정";

    await notificationService.create({
      user_id: userId,
      title: "오늘의 감정 분석 완료",
      message: `오늘 감정은 '${emotionLabelKor}'입니다.`,
      type: 2,
    });

    console.log(`📬 [Step 4] Notification 발송 성공!`);
    console.log(`🏁 [AI Workflow] 최종 완료!`);
  } catch (err) {
    console.error(`❌ [AI Workflow] 에러:`, err.message);
  }
};
