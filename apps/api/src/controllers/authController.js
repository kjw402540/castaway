// src/controllers/authController.js
import * as authService from "../services/authService.js";

/* ----------------------------------------
   회원가입
----------------------------------------- */
export const signup = async (req, res, next) => {
  try {
    const user = await authService.signup(req.body);

    // 보안 처리
    const { password_hash, ...safeUser } = user;

    res.json(safeUser);
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------
   로그인
----------------------------------------- */
export const login = async (req, res, next) => {
  try {
    const user = await authService.login(req.body);

    // 보안 처리
    const { password_hash, ...safeUser } = user;

    res.json(safeUser);
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------
   로그아웃 (JWT 없음 버전)
----------------------------------------- */
export const logout = async (req, res, next) => {
  try {
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
