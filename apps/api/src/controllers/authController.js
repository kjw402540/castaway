// src/controllers/authController.js
import * as authService from "../services/authService.js";



/* 회원가입 */
export const signup = async (req, res, next) => {
  console.log("REQ BODY:", req.body);
  try {
    const user = await authService.signup(req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/* 로그인 */
export const login = async (req, res, next) => {
  try {
    const user = await authService.login(req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/* 로그아웃 */
export const logout = async (req, res, next) => {
  try {
    res.json({ ok: true, message: "Logged out" });
  } catch (err) {
    next(err);
  }
};
