// src/controllers/emotionController.js
import * as emotionService from "../services/emotionService.js";

/* ----------------------------------------
   감정 분석 API
   지금은 모델 없음 → placeholder
----------------------------------------- */
export const analyze = async (req, res, next) => {
  try {
    const { text } = req.body;
    const result = await emotionService.analyze(text);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
