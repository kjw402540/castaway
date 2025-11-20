/*
  감정 분석 / 임베딩 생성 서비스
  여기만 네 모델 연결하면 완성됨.
*/

export async function analyzeDiaryText(text) {
  // 실제 모델 연결할 자리
  // 지금은 mock
  return {
    summary: "자동 요약 결과",
    main_emotion: "sadness",
    keywords: ["힘듦", "고됨", "스트레스"],
    embedding: Array.from({ length: 384 }, () => Math.random()), // float[384]
  };
}
