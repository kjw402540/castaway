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