// src/services/diaryWorkflow.js

import * as emotionService from "./emotionService.js";
import * as objectService from "./objectService.js";
import * as bgmService from "./bgmService.js";
import * as notificationService from "./notificationService.js";
import * as clusterService from "./clusterService.js";

/* -------------------------------------------------------------
   일기 저장 직후 실행되는 전체 파이프라인
-------------------------------------------------------------- */
export async function afterDiarySaved(diary) {
  try {
    console.log("[WORKFLOW] started for diary:", diary.diary_id);

    // 1) 감정 분석 (AI 모델 자리 비워둠)
    const emotionResult = await analyzeEmotion(diary);

    // 2) 오브제 생성
    const objectItem = await createObject(diary, emotionResult);

    // 3) BGM 생성
    const bgmItem = await createBgm(diary, emotionResult);

    // 4) 개인 알림 생성
    await sendUserNotification(diary, emotionResult, objectItem, bgmItem);

    // 5) 같은 클러스터 사람들에게 공유 (선택)
    // await clusterBroadcast(diary, emotionResult, objectItem);

    console.log("[WORKFLOW] finished");
    return true;
  } catch (err) {
    console.error("[WORKFLOW ERROR]", err);
    return false;
  }
}

/* -------------------------------------------------------------
   1) 감정 분석 (모델 자리만 남겨둠)
-------------------------------------------------------------- */
async function analyzeEmotion(diary) {
  const text = diary.original_text;

  // AI 모델은 나중에 직접 연결할 자리
  // 지금은 placeholder
  const resultData = {
    diary_id: diary.diary_id,
    summary_text: "(아직 분석 로직 없음)",
    main_emotion: "neutral",
    keyword_1: null,
    keyword_2: null,
    keyword_3: null,
    embedding: [], // pgvector 제거했으므로 Float[]
  };

  // ☆ EmotionResult UPSERT
  const emotionResult = await emotionService.save(resultData);

  return emotionResult;
}

/* -------------------------------------------------------------
   2) 오브제 생성 (하루 1개)
-------------------------------------------------------------- */
async function createObject(diary, emotionResult) {
  try {
    const data = {
      diary_id: diary.diary_id,
      user_id: diary.user_id,
      emotion_id: emotionResult.emotion_id,
      object_name: selectObjectName(emotionResult.main_emotion),
      object_image: "", // 이미지 경로 나중에 넣는 자리
    };

    // diary_id UNIQUE → 자동으로 하루 1개
    const objectItem = await objectService.create(data);

    return objectItem;
  } catch (err) {
    console.error("[WORKFLOW][OBJECT] error", err);
    return null;
  }
}

// 아주 단순한 오브제 선택 (나중에 정교하게 바꿔도 됨)
function selectObjectName(emotion) {
  const map = {
    joy: "light_orb",
    sadness: "blue_drop",
    anger: "fire_stone",
    neutral: "shell",
    fear: "fog_fragment",
  };
  return map[emotion] ?? "shell";
}

/* -------------------------------------------------------------
   3) BGM 생성 (placeholder)
-------------------------------------------------------------- */
async function createBgm(diary, emotionResult) {
  try {
    const data = {
      diary_id: diary.diary_id,
      user_id: diary.user_id,
      emotion_id: emotionResult.emotion_id,
      bgm_url: "", // 나중에 AIGen 붙일 자리
    };

    const bgm = await bgmService.create(data);
    return bgm;
  } catch (err) {
    console.error("[WORKFLOW][BGM] error", err);
    return null;
  }
}

/* -------------------------------------------------------------
   4) 사용자 개인 알림
-------------------------------------------------------------- */
async function sendUserNotification(diary, emotionResult, objectItem, bgmItem) {
  try {
    const msg = `오늘의 감정 분석이 완료되었습니다. (${emotionResult.main_emotion})`;

    await notificationService.create({
      user_id: diary.user_id,
      message: msg,
      type: "system",
    });

    return true;
  } catch (err) {
    console.error("[WORKFLOW][NOTIFICATION] error", err);
    return false;
  }
}

/* -------------------------------------------------------------
   5) 같은 Cluster 사용자들에게도 공유 (옵션)
-------------------------------------------------------------- */
async function clusterBroadcast(diary, emotionResult, objectItem) {
  try {
    const userClusterId = diary.user.cluster_id;
    const users = await clusterService.getUsers(userClusterId);

    // 본인 제외한 같은 그룹 유저들에게 랜덤 오브제 알림
    for (const u of users) {
      if (u.user_id === diary.user_id) continue;

      await notificationService.create({
        user_id: u.user_id,
        message: "새로운 감정 오브제가 도착했습니다!",
        type: "cluster",
      });
    }
  } catch (err) {
    console.error("[WORKFLOW][CLUSTER] error", err);
  }
}
