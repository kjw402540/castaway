// src/routes/diaryRoutes.js
import express from "express";
import * as diaryController from "../controllers/diaryController.js";
import { authRequired } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 이 아래 라우트 전부 JWT 인증 필요 (지금은 개발용으로 자동 user 1)
router.use(authRequired);

// GET /diary → 전체 조회
router.get("/", diaryController.getAll);

// GET /diary/2025-01-10 ← 날짜 기반 조회
router.get("/:date", diaryController.getByDate);

// POST /diary → 생성
router.post("/", diaryController.create);

// DELETE /api/diary/2025-11-25 → 날짜 기반 삭제
router.delete("/:date", diaryController.remove);

export default router;
