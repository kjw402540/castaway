// src/services/emotionService.js
import prisma from "../lib/prisma.js";

/* ----------------------------------------
   감정 분석 placeholder
   실제 모델 연결은 나중에 추가
----------------------------------------- */
export const analyze = async (text) => {
  if (!text) {
    throw new Error("text는 필수입니다.");
  }

  // 아주 단순한 감정 placeholder
  const result = {
    emotion: "neutral",
    summary: "(아직 감정 분석 모델 없음)",
    keywords: [],
  };

  return result;
};
