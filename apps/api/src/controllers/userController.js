// src/controllers/userController.js
import * as userService from "../services/userService.js";

const USER_ID = 1;

/* ----------------------------------------
   내 정보 조회
----------------------------------------- */
export const get = async (req, res, next) => {
  try {
    const user = await userService.get(USER_ID);
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
    const updated = await userService.update(USER_ID, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------
   회원 탈퇴 (soft delete)
----------------------------------------- */
export const remove = async (req, res, next) => {
  try {
    const removed = await userService.remove(USER_ID);
    res.json({ ok: true, removed });
  } catch (err) {
    next(err);
  }
};
