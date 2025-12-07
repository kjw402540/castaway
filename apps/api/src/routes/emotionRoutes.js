// src/routes/emotionRoutes.js
import express from "express";
import * as emotionController from "../controllers/emotionController.js";

const router = express.Router();

// 기존 라우트: POST /emotion
router.post("/", emotionController.analyze);

// 💡 새로운 라우트: POST /emotion/day-vector (Day Vector 생성 및 DB 저장)
router.post("/day-vector", emotionController.createEmotionRecord);

export default router;