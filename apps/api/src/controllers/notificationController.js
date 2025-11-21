// src/controllers/notificationController.js
import * as notificationService from "../services/notificationService.js";

/* ----------------------------------------
   유저의 알림 목록 조회
----------------------------------------- */
export const getByUser = async (req, res, next) => {
  try {
    const userId = 1; // MVP 고정
    const list = await notificationService.getByUser(userId, 30);
    res.json(list);
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------
   단일 알림 조회
----------------------------------------- */
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await notificationService.getById(Number(id));
    res.json(item);
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------
   알림 삭제
----------------------------------------- */
export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removed = await notificationService.remove(Number(id));
    res.json({ ok: true, removed });
  } catch (err) {
    next(err);
  }
};
