// src/controllers/emotionController.js
import { analyze as analyzeAI } from "../services/emotionAIService.js";

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
