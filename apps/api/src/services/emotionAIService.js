// src/services/emotionAIService.js

export async function analyze(text) {
  // 실제 모델 붙일 때 이 부분 교체하면 됨
  return {
    summary: text.slice(0, 20) + "...",
    main_emotion: "Neutral",
    keywords: ["none", "none", "none"],
    embedding: [0.01, 0.02, 0.03, 0.04],
  };
}
