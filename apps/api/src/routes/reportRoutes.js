// src/routes/reportRoutes.js
import express from "express";
import * as reportController from "../controllers/reportController.js";

const router = express.Router();

router.get("/weekly", reportController.getWeekly);
router.get("/history", reportController.getHistory);

// 단일 리포트 상세 조회  ← 수정됨
router.get("/item/:id", reportController.getById);

router.post("/", reportController.save);

export default router;
