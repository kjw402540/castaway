// src/services/diaryWorkflow.js

import { saveDiary } from "./diaryService";
import { analyzeEmotion } from "./emotionService";
import { createObjectByEmotion } from "./objectService";
import { addMail } from "./mailService";

/**
 * 일기 저장 + 감정 분석 + 오브제 생성 + 메일 도착
 * 모든 흐름을 한 번에 처리하는 통합 워크플로우
 */
export async function saveDiaryPipeline({ date, text }) {
  if (!text.trim()) {
    throw new Error("일기 내용이 비어 있습니다.");
  }

  // 1) 감정 분석
  const emotion = await analyzeEmotion(text);

  // 2) 일기 저장
  await saveDiary({
    date,
    text,
    emotion,
    keywords: [],
    object: null,
    audio: null,
  });

  // 3) 감정 기반 오브제 생성
  const newObject = await createObjectByEmotion(emotion);

  // 4) Mail에 자동 생성
  addMail({
    id: Date.now().toString(),
    title: "새 오브제가 도착했어요!",
    message: `오늘의 감정(${emotion})에 맞는 오브제가 섬에 도착했습니다.`,
    emotion,
    object: newObject,
    date: new Date().toISOString(),
    read: false,
  });

  // 5) HomePage에서 팝업 띄울 수 있도록 반환
  return {
    emotion,
    object: newObject,
  };
}
