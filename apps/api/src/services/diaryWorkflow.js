// src/services/diaryWorkflow.js

import * as emotionAIService from "./emotionAIService.js";
import * as emotionService from "./emotionService.js";
import * as objectService from "./objectService.js";
import * as bgmService from "./bgmService.js";
import * as notificationService from "./notificationService.js";
import * as mailService from "../services/mailService.js";


/* -------------------------------------------------------------
   일기 저장 직후 실행되는 전체 파이프라인
-------------------------------------------------------------- */
export async function afterDiarySaved(diary) {
  try {
    console.log("[WORKFLOW] started for diary:", diary.diary_id);

    // 1) 감정 분석
    const emotionResult = await analyzeEmotion(diary);

    // 2) 오브제 생성
    const objectItem = await createObject(diary, emotionResult);

    // 3) BGM 생성
    const bgmItem = await createBgm(diary, emotionResult);

    // 4) 개인 알림 생성
    await sendUserNotification(diary, emotionResult);

    // 5) 메일 생성
    await sendMail(diary, emotionResult);


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
    embedding: ai.embedding ?? new Array(384).fill(0),
  };

  const emotionResult = await emotionService.save(resultData);
  return emotionResult;
}

/* -------------------------------------------------------------
   2) 오브제 생성
-------------------------------------------------------------- */
async function createObject(diary, emotionResult) {
  try {
    const objectName = pickObjectNameByEmotion(emotionResult.main_emotion);

    const data = {
      diary_id: diary.diary_id,
      user_id: diary.user_id,
      emotion_id: emotionResult.emotion_id,
      object_name: objectName,
      object_image: "",
    };

    return await objectService.create(data);

  } catch (err) {
    console.error("[WORKFLOW][OBJECT] error", err);
    return null;
  }
}

/* 감정(int) 기반 오브제 이름 선택 */
function pickObjectNameByEmotion(mainEmotionInt) {
  const map = {
    0: "fire_stone",
    1: "light_orb",
    2: "shell",
    3: "blue_drop",
    4: "fog_fragment",
  };
  return map[mainEmotionInt] ?? "shell";
}

/* -------------------------------------------------------------
   3) BGM 생성
-------------------------------------------------------------- */
async function createBgm(diary, emotionResult) {
  try {
    const data = {
      diary_id: diary.diary_id,
      user_id: diary.user_id,
      emotion_id: emotionResult.emotion_id,
      bgm_url: "",
    };

    return await bgmService.create(data);

  } catch (err) {
    console.error("[WORKFLOW][BGM] error", err);
    return null;
  }
}

/* -------------------------------------------------------------
   4) 사용자 알림 생성
   DB 스펙: INT
   0 = 리포트, 1 = 오브제, 2 = 일반 알림
-------------------------------------------------------------- */
async function sendUserNotification(diary, emotionResult) {
  try {
    const msg = `오늘의 감정 분석이 완료되었습니다. (감정: ${emotionResult.main_emotion})`;

    await notificationService.create({
      user_id: diary.user_id,
      message: msg,
      type: 2,    // INT
    });

    return true;

  } catch (err) {
    console.error("[WORKFLOW][NOTIFICATION] error", err);
    return false;
  }
}

// -------------------------------------------------------------
// 5) 감정 분석 완료 → Mail 생성
// -------------------------------------------------------------
async function sendMail(diary, emotionResult) {
  try {
    const emotionName = ["분노/혐오", "기쁨", "중립", "슬픔", "놀람/공포"][emotionResult.main_emotion];

    const mailData = {
      user_id: diary.user_id,
      title: "오늘의 감정 분석 결과가 도착했어요",
      content: `오늘 감정은 '${emotionName}'로 분석되었어요.\n키워드: ${emotionResult.keyword_1}, ${emotionResult.keyword_2}, ${emotionResult.keyword_3}`,
    };

    await mailService.create(mailData);
  } catch (err) {
    console.error("[WORKFLOW][MAIL] error", err);
  }
}
