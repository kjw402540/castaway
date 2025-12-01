// src/routes/reportRoutes.js
import express from "express";
import * as reportController from "../controllers/reportController.js";

const router = express.Router();

// 1. 이번 주 리포트 조회
router.get("/weekly", reportController.getWeekly);

// 2. 전체 히스토리 조회
router.get("/history", reportController.getHistory);

// 3. 단일 리포트 상세 조회 (기존 경로 유지)
router.get("/item/:id", reportController.getById);

// 4. [수정됨] 주간 리포트 생성 (AI 분석)
// 기존 save -> generate 로 변경!
// 요청 주소: POST http://localhost:PORT/report/generate
router.post("/generate", reportController.generate);

export default router;