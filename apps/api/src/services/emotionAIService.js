// src/services/emotionAIService.js

import axios from 'axios';

// 환경 변수가 설정되어 있다고 가정합니다.
const AI_SERVER_BASE_URL = process.env.AI_SERVER_URL || "http://172.31.19.26:8000";

export async function analyze(text) {
  // 실제 모델 붙일 때 이 부분 교체하면 됨
  return {
    summary: text.slice(0, 20) + "...",
    main_emotion: "Neutral",
    keywords: ["none", "none", "none"],
    embedding: [0.01, 0.02, 0.03, 0.04],
  };
}

/**
 * Day Vector 생성을 위해 AI 서버에 요청합니다.
 * @param {object} data - user_id, emotion_label, softmax, keyword1, keyword2 등
 * @returns {Promise<number[]>} Day Vector (1550차원 배열)
 */
export async function createDayVector(data) {
  // 실제 AI 서버 호출
  try {
    const response = await axios.post(
      `${AI_SERVER_BASE_URL}/emotion/day-vector`,
      data
    );

    // AI 서버 응답이 { day_vector: [...] } 형태라고 가정
    if (response.status !== 200 || !response.data.day_vector) {
      throw new Error("AI 서버에서 Day Vector 생성에 실패했거나 응답 형식이 잘못되었습니다.");
    }
    
    // Day Vector는 1550차원 배열입니다.
    return response.data.day_vector; 

  } catch (error) {
    // 임시 Mock 데이터 반환 (실제 배포 전에는 반드시 제거 필요)
    if (AI_SERVER_BASE_URL.includes("localhost")) {
      console.warn("⚠️ [AI Service Warning] Day Vector 요청 실패. Localhost 환경이므로 1550차원 Mock 데이터 반환.");
      // 1550차원의 Mock 데이터 반환
      return new Array(1550).fill(0).map(() => Math.random() * 0.1); 
    }
    
    console.error(`❌ [AI Service Error] Day Vector 요청 실패: ${error.message}`);
    throw new Error(`AI 서버 통신 오류: ${error.message}`);
  }
}