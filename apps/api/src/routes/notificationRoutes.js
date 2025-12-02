// --------------------------------------------------------
// apps/api/src/routes/notificationRoutes.js
// Notification Router
// --------------------------------------------------------

import express from "express";
import * as controller from "../controllers/notificationController.js";
import { authRequired } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔥 모든 Notification API는 인증 필요
router.use(authRequired);

// 전체 조회
router.get("/", controller.getList);

// 단일 조회
router.get("/:id", controller.getById);

// 생성
router.post("/", controller.create);

// 읽음 처리
router.patch("/:id/read", controller.markAsRead);

// --------------------------------------------------------
// 🔥 선택/전체 삭제
//  - DELETE /notification        + body { ids: [...] }
//  - DELETE /notification/all    → 현재 유저 전체 삭제
// --------------------------------------------------------
router.delete("/all", controller.removeBulk);   // "all" URL 전용
router.delete("/", controller.removeBulk);      // body.ids 전용

// 단일 삭제
router.delete("/:id", controller.remove);

export default router;
