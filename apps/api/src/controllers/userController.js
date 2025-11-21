// src/controllers/userController.js
import * as userService from "../services/userService.js";

/* ----------------------------------------
   내 정보 조회
----------------------------------------- */
export const get = async (req, res, next) => {
  try {
    const userId = 1; // MVP 고정
    const user = await userService.get(userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------
   프로필 수정
----------------------------------------- */
export const update = async (req, res, next) => {
  try {
    const userId = 1; // MVP 고정
    const updated = await userService.update(userId, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------
   회원 탈퇴
----------------------------------------- */
export const remove = async (req, res, next) => {
  try {
    const userId = 1; // MVP 고정
    const removed = await userService.remove(userId);
    res.json({ ok: true, removed });
  } catch (err) {
    next(err);
  }
};
