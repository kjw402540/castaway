// src/services/diaryWorkflow.js

import * as emotionAIService from "./emotionAIService.js";
import * as emotionService from "./emotionService.js";
// import * as objectService from "./objectService.js";
// import * as bgmService from "./bgmService.js";
import * as notificationService from "./notificationService.js";

export async function afterDiarySaved(diary) {
  try {
    console.log("[WORKFLOW] started for diary:", diary.diary_id);

    const emotionResult = await analyzeEmotion(diary);

    // 2) 오브제 생성 (일단 비활성화)
    // await createObject(diary, emotionResult);
    console.log("[WORKFLOW] SKIP object creation (not implemented)");

    // 3) BGM 생성 (일단 비활성화)
    // await createBgm(diary, emotionResult);
    console.log("[WORKFLOW] SKIP BGM creation (not implemented)");

    await sendUserNotification(diary, emotionResult);
    await sendMailNotification(diary, emotionResult);

    console.log("[WORKFLOW] finished");
    return true;

  } catch (err) {
    console.error("[WORKFLOW ERROR]", err);
    return false;
  }
}

/* --------------------- 1) 감정 분석 저장 --------------------- */
async function analyzeEmotion(diary) {
  const ai = await emotionAIService.analyze(diary.original_text);

  const resultData = {
    diary_id: diary.diary_id,
    summary_text: ai.summary ?? "(요약 없음)",
    main_emotion: ai.main_emotion ?? 2,
    keyword_1: ai.keywords?.[0] ?? "",
    keyword_2: ai.keywords?.[1] ?? "",
    keyword_3: ai.keywords?.[2] ?? "",
    embedding: ai.embedding ?? new Array(384).fill(0),
  };

  return await emotionService.save(resultData);
}

/* --------------------- 4) 일반 알림 생성 --------------------- */
async function sendUserNotification(diary, emotionResult) {
  try {
    await notificationService.create({
      user_id: diary.user_id,
      title: "감정 분석 완료",
      message: `오늘 감정이 분석되었어요. (메인 감정: ${emotionResult.main_emotion})`,
      type: 2,
    });

    return true;
  } catch (err) {
    console.error("[WORKFLOW][NOTIFICATION] error", err);
    return false;
  }
}

/* --------------------- 5) Mail 알림 생성 --------------------- */
async function sendMailNotification(diary, emotionResult) {
  try {
    const emotionName = [
      "분노/혐오",
      "기쁨",
      "중립",
      "슬픔",
      "놀람/공포"
    ][emotionResult.main_emotion];

    await notificationService.create({
      user_id: diary.user_id,
      title: "오늘의 감정 분석 결과",
      message:
        `오늘 감정은 '${emotionName}'으로 분석되었어요.\n` +
        `키워드: ${emotionResult.keyword_1}, ${emotionResult.keyword_2}, ${emotionResult.keyword_3}`,
      type: 3,
    });
  } catch (err) {
    console.error("[WORKFLOW][MAIL] error", err);
  }
}
