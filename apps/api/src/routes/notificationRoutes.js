// src/routes/notificationRoutes.js
import express from "express";
import * as notificationController from "../controllers/notificationController.js";

const router = express.Router();

/* ----------------------------------------
   최신 알림 N개 조회
   GET /notification
----------------------------------------- */
router.get("/", notificationController.getByUser);

/* ----------------------------------------
   알림 단일 조회
   GET /notification/:id
----------------------------------------- */
router.get("/:id", notificationController.getById);

/* ----------------------------------------
   알림 삭제
   DELETE /notification/:id
----------------------------------------- */
router.delete("/:id", notificationController.remove);

export default router;
