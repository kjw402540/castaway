// src/routes/notificationRoutes.js
import express from "express";
import * as controller from "../controllers/notificationController.js";

const router = express.Router();

/* 최신 알림 조회 */
router.get("/", controller.getByUser);

/* 단일 조회 */
router.get("/:id", controller.getById);

/* 읽음 처리 */
router.patch("/:id/read", controller.markAsRead);

/* 선택/전체 삭제 */
router.delete("/", controller.removeBulk);

/* 단일 삭제 */
router.delete("/:id", controller.remove);

export default router;
