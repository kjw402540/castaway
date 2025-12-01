// src/routes/notificationRoutes.js

import { Router } from "express";
import * as ctrl from "../controllers/notificationController.js";

const router = Router();

// 전체 조회 (?type=3 → Mail만)
router.get("/", ctrl.getList);

// 단일 조회
router.get("/:id", ctrl.getById);

// 생성 (Mail 포함)
router.post("/", ctrl.create);

// 읽음 처리
router.patch("/:id/read", ctrl.markAsRead);

// 삭제
router.delete("/:id", ctrl.remove);

export default router;
