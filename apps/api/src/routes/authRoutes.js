// src/routes/authRoutes.js
import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

/* ----------------------------------------
   회원가입
   POST /auth/signup
----------------------------------------- */
router.post("/signup", authController.signup);

/* ----------------------------------------
   로그인
   POST /auth/login
----------------------------------------- */
router.post("/login", authController.login);

/* ----------------------------------------
   로그아웃 (프론트에서 토큰 삭제용)
   POST /auth/logout
----------------------------------------- */
router.post("/logout", authController.logout);

export default router;

