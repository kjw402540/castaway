// src/services/emotionService.js
import { USE_API } from "../config/apiConfig";
import { emotionApi } from "../api/emotionApi";
import { emotionMock } from "../mocks/emotionMock";

export const analyzeEmotion = async (text) => {
  console.log("🔍 emotionService - Input text:", text?.substring(0, 50)); // 텍스트 일부만 출력
  console.log("🔍 emotionService - USE_API:", USE_API);
  
  if (!text) {
    console.log("🔍 emotionService - No text, returning Neutral");
    return "Neutral";
  }

  if (USE_API) {
    try {
      console.log("🔍 emotionService - Calling API...");
      const res = await emotionApi.analyze(text);
      console.log("🔍 emotionService - API response:", res);
      const data = res?.data ?? res;
      console.log("🔍 emotionService - Extracted data:", data);
      const emotion = data.emotion ?? "Neutral";
      console.log("🔍 emotionService - Final emotion:", emotion);
      return emotion;
    } catch (error) {
      console.error("🔍 emotionService - API error:", error);
      return "Neutral";
    }
  }

  try {
    console.log("🔍 emotionService - Calling Mock...");
    const mockResult = await emotionMock.analyze(text);
    console.log("🔍 emotionService - Mock result:", mockResult);
    const emotion = mockResult.emotion ?? "Neutral";
    console.log("🔍 emotionService - Final emotion:", emotion);
    return emotion;
  } catch (error) {
    console.error("🔍 emotionService - Mock error:", error);
    return "Neutral";
  }
};

// ----------------------------------------------------------------
// 2. [NEW] 오늘의 감정 예측 조회 (추가된 부분)
// ----------------------------------------------------------------
export const getTodayPrediction = async () => {
  if (USE_API) {
    try {
      // API 호출
      const response = await emotionApi.getToday();
      
      // axios인 경우 data를 벗겨내고, fetch인 경우 그대로 사용 (프로젝트 환경에 맞춤)
      const data = response?.data ?? response;
      
      // 데이터가 있고 exists: true 일 때만 반환
      if (data && data.exists) {
        return data; 
      }
      return null;
    } catch (err) {
      console.error("❌ emotionService - 예측 데이터 조회 실패:", err);
      return null;
    }
  } else {
    // Mock 데이터 사용 (테스트용)
    // emotionMock.getToday()가 없다면 아래 객체 바로 리턴
    return {
      exists: true,
      emotion_id: 2,
      text: "평온/무난 (Mock)",
      created_at: new Date().toISOString()
    };
  }
};