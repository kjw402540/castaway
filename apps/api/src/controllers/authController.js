// apps/api/src/controllers/authController.js

import axios from "axios";
import * as authService from "../services/authService.js";
import { signToken } from "../lib/jwt.js";
import { findOrCreateKakaoUser } from "../services/userService.js";

const KAKAO_USER_API = "https://kapi.kakao.com/v2/user/me";

/* ----------------------------------------
   이메일/일반 회원가입 + JWT 발급
----------------------------------------- */
export const signup = async (req, res, next) => {
  try {
    // authService.signup 안에서 실제 DB insert + 비번 해시 처리
    const user = await authService.signup(req.body);

    if (!user) {
      return res.status(500).json({ message: "회원가입 처리 중 오류가 발생했습니다." });
    }

    // 비밀번호 해시 제거
    const { password_hash, ...safeUser } = user;

    // JWT 발급 (카카오와 동일한 규칙 사용)
    const token = signToken(user);

    // 프론트에서 기대하는 형태로 응답
    return res.status(201).json({
      token,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------
   이메일/일반 로그인 + JWT 발급
----------------------------------------- */
export const login = async (req, res, next) => {
  try {
    // authService.login 안에서 이메일/비번 검증 + 유저 조회
    const user = await authService.login(req.body);

    if (!user) {
      return res.status(401).json({ message: "로그인에 실패했습니다." });
    }

    const { password_hash, ...safeUser } = user;

    const token = signToken(user);

    return res.json({
      token,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------
   로그아웃 (JWT 없음 버전 - 클라이언트에서 토큰 삭제)
----------------------------------------- */
export const logout = async (req, res, next) => {
  try {
    // 서버에서 별도 세션을 관리하지 않으므로 단순 ok 응답
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------
   카카오 로그인 + JWT 발급
----------------------------------------- */
export const kakaoLogin = async (req, res, next) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: "accessToken 누락" });
    }

    // 1) 카카오에 accessToken 검증 + 유저 정보 요청
    const kakaoRes = await fetch(KAKAO_USER_API, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    if (!kakaoRes.ok) {
      const errBody = await kakaoRes.text();
      console.error("Kakao API error:", kakaoRes.status, errBody);
      return res.status(401).json({ message: "카카오 인증 실패" });
    }

    const kakaoUser = await kakaoRes.json();

    // 2) 우리 DB user 찾거나 생성
    const user = await findOrCreateKakaoUser(kakaoUser);

    // 3) JWT 발급
    const token = signToken(user);

    return res.json({
      token,
      user: {
        user_id: user.user_id,
        nickname: user.nickname,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("kakaoLogin error:", err);
    next(err);
  }
};
