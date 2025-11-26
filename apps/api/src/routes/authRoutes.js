import express from "express";
import {
  signup,
  login,
  logout,
  kakaoLogin,
} from "../controllers/authController.js";

const router = express.Router();

// 이메일 + 비밀번호 회원가입 (JWT 발급)
router.post("/signup", signup);

// 일반 로그인 (JWT 발급)
router.post("/login", login);

// 로그아웃
router.post("/logout", logout);

// 카카오 OAuth 로그인 (JWT 발급)
router.post("/kakao", kakaoLogin);

export default router;
