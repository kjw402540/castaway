import express from "express";
import * as emotionController from "../controllers/emotionController.js";
import { authRequired } from "../middlewares/authMiddleware.js"; // 미들웨어 경로 확인!

const router = express.Router();

// ----------------------------------------------------------------
// 🔐 인증이 필요한 라우트들
// ----------------------------------------------------------------

// 1. 오늘의 감정 예측 조회 (홈 화면용)
// GET /api/emotion/today
router.get("/today", authRequired, emotionController.getTodayPrediction);

// 2. 텍스트 감정 분석 (일기 작성 중 사용)
// POST /api/emotion
// (분석도 로그인한 사람만 하게 하려면 여기에 둠 / 아니면 위로 뺄 수도 있음)
router.post("/", authRequired, emotionController.analyze);

export default router;