// src/controllers/emotionController.js
import { analyze as analyzeAI } from "../services/emotionAIService.js";
import { generateDayVectorAndSave } from "../services/emotionService.js"; // 서비스 함수 임포트

export const analyze = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.json({
        summary: "",
        main_emotion: "Neutral",
        keywords: ["none", "none", "none"],
        embedding: [],
      });
    }

    const result = await analyzeAI(text);

    res.json(result);

  } catch (err) {
    next(err);
  }
};


/**
 * POST /emotion/day-vector 요청 처리:
 * 1. AI 서버에 Day Vector 생성을 요청합니다.
 * 2. Day Vector와 다른 필드들을 EmotionResult 테이블에 저장합니다.
 */
export const createEmotionRecord = async (req, res, next) => {
    try {
        // 요청 바디: user_id, emotion_label, softmax, embedding, keyword1, keyword2 등
        const dayVectorData = req.body;

        if (!dayVectorData.user_id || !dayVectorData.emotion_label) {
            return res.status(400).json({ message: "필수 요청 데이터(user_id, emotion_label)가 누락되었습니다." });
        }

        // 서비스 로직 호출 (Day Vector 생성 및 DB 저장)
        const dayVector = await generateDayVectorAndSave(dayVectorData);

        // 클라이언트에 성공 메시지를 반환
        res.status(201).json({ 
            message: "Day Vector 생성 및 감정 기록 저장 성공",
            day_vector_length: dayVector.length 
        });

    } catch (err) {
        // 서비스에서 발생한 오류 처리
        next(err);
    }
}