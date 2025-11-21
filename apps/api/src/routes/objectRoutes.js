// src/routes/objectRoutes.js
import express from "express";
import * as objectController from "../controllers/objectController.js";

const router = express.Router();

/* ----------------------------------------
   단일 오브제 조회: GET /object/item/:id
   (구체적인 라우트이므로 제일 위!)
----------------------------------------- */
router.get("/item/:id", objectController.getById);

/* ----------------------------------------
   특정 날짜 오브제 조회: GET /object/:date
----------------------------------------- */
router.get("/:date", objectController.getByDate);

/* ----------------------------------------
   전체 오브제 목록: GET /object
----------------------------------------- */
router.get("/", objectController.getAll);

/* ----------------------------------------
   오브제 삭제: DELETE /object/item/:id
   (→ 세트 삭제: Diary + Object + BGM)
----------------------------------------- */
router.delete("/item/:id", objectController.remove);

/* ----------------------------------------
   오브제 배치: POST /object/place/:id
   (나중에 위치 좌표 저장 용도)
----------------------------------------- */
router.post("/place/:id", objectController.place);

export default router;
