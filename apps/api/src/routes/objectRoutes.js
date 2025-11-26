// src/routes/objectRoutes.js
import express from "express";
import * as objectController from "../controllers/objectController.js";

const router = express.Router();

/* 단일 조회 */
router.get("/item/:id", objectController.getById);

/* 전체 오브제 */
router.get("/", objectController.getAll);

/* 배치 (미구현) */
router.post("/place/:id", objectController.place);

/* 삭제 (세트 삭제) */
router.delete("/item/:id", objectController.remove);

/* 날짜별 조회 ← 가장 아래 + prefix */
router.get("/date/:date", objectController.getByDate);

export default router;
