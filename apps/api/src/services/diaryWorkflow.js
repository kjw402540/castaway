// src/services/diaryWorkflow.js
// 감정 분석 후 → EmotionResult 저장 + Notification 생성만 수행

import * as emotionAIService from "./emotionAIService.js";
import * as emotionService from "./emotionService.js";
import * as notificationService from "./notificationService.js";
// import * as objectService from "./objectService.js";   // 🔥 당분간 사용 안 함
// import * as bgmService from "./bgmService.js";         // 🔥 당분간 사용 안 함

/**
 * 일기 저장 직후 실행되는 전체 파이프라인
 */
export async function afterDiarySaved(diary) {
  try {
    console.log("[WORKFLOW] started for diary:", diary.diary_id);

    // 1) 감정 분석 (EmotionResult 저장)
    const emotionResult = await analyzeEmotion(diary);

    // 2) 오브제 생성 (모델 붙일 때 다시 활성화)
    // await createObject(diary, emotionResult);

    // 3) BGM 생성 (모델 붙일 때 다시 활성화)
    // await createBgm(diary, emotionResult);

    // 4) 알림 생성 (User에게 결과 알려줌)
    await sendUserNotification(diary, emotionResult);

    console.log("[WORKFLOW] finished");
    return true;

  } catch (err) {
    console.error("[WORKFLOW ERROR]", err);
    return false;
  }
}

/* -------------------------------------------------------------
   1) 감정 분석 + EmotionResult DB 저장
-------------------------------------------------------------- */
async function analyzeEmotion(diary) {
  const ai = await emotionAIService.analyze(diary.original_text);

  const resultData = {
    diary_id: diary.diary_id,
    summary_text: ai.summary ?? "(요약 없음)",
    main_emotion: ai.main_emotion ?? 2,
    keyword_1: ai.keywords?.[0] ?? "",
    keyword_2: ai.keywords?.[1] ?? "",
    keyword_3: ai.keywords?.[2] ?? "",
  };

  const emotionResult = await emotionService.save(resultData);
  return emotionResult;
}

/* -------------------------------------------------------------
   2) 오브제 생성 — 현재 비활성화
-------------------------------------------------------------- */
// async function createObject(diary, emotionResult) {
//   try {
//     const objectName = pickObjectNameByEmotion(emotionResult.main_emotion);

//     await objectService.create({
//       diary_id: diary.diary_id,
//       user_id: diary.user_id,
//       emotion_id: emotionResult.emotion_id,
//       object_name: objectName,
//       object_image: "",
//     });

//   } catch (err) {
//     console.error("[WORKFLOW][OBJECT] error", err);
//   }
// }

// function pickObjectNameByEmotion(mainEmotionInt) {
//   const map = {
//     0: "fire_stone",
//     1: "light_orb",
//     2: "shell",
//     3: "blue_drop",
//     4: "fog_fragment",
//   };
//   return map[mainEmotionInt] ?? "shell";
// }

/* -------------------------------------------------------------
   3) BGM 생성 — 현재 비활성화
-------------------------------------------------------------- */
// async function createBgm(diary, emotionResult) {
//   try {
//     await bgmService.create({
//       diary_id: diary.diary_id,
//       user_id: diary.user_id,
//       emotion_id: emotionResult.emotion_id,
//       bgm_url: "",
//     });
//   } catch (err) {
//     console.error("[WORKFLOW][BGM] error", err);
//   }
// }

/* -------------------------------------------------------------
   4) Notification 생성
-------------------------------------------------------------- */
async function sendUserNotification(diary, emotionResult) {
  try {
    const emotionLabel = [
      "분노/혐오",
      "기쁨",
      "중립",
      "슬픔",
      "놀람/공포",
    ][emotionResult.main_emotion] ?? "감정";

    await notificationService.create({
      user_id: diary.user_id,
      title: "오늘의 감정 분석 완료",
      message: `오늘 감정은 '${emotionLabel}'입니다.`,
      type: 2,
    });

  } catch (err) {
    console.error("[WORKFLOW][NOTIFICATION] error", err);
  }
}
