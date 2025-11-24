// src/controllers/notificationController.js
import * as notificationService from "../services/notificationService.js";

const USER_ID = 1;

/* 전체 */
export const getByUser = async (req, res, next) => {
  try {
    const list = await notificationService.getByUser(USER_ID, 30);
    res.json(list);
  } catch (err) {
    next(err);
  }
};

/* 단일 */
export const getById = async (req, res, next) => {
  try {
    const item = await notificationService.getById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

/* 삭제 */
export const remove = async (req, res, next) => {
  try {
    const removed = await notificationService.remove(req.params.id);
    res.json({ ok: true, removed });
  } catch (err) {
    next(err);
  }
};
