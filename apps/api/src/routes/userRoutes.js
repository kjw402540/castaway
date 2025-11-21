// src/routes/userRoutes.js
import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();

/* ----------------------------------------
   내 정보 조회
   GET /user
----------------------------------------- */
router.get("/", userController.get);

/* ----------------------------------------
   프로필 수정
   PATCH /user
----------------------------------------- */
router.patch("/", userController.update);

/* ----------------------------------------
   회원 탈퇴
   DELETE /user
----------------------------------------- */
router.delete("/", userController.remove);

export default router;
