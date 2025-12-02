// src/controllers/notificationController.js


import * as notificationService from "../services/notificationService.js";

function getUserId(req) {
  return req.user?.id || Number(req.query.userId) || 1;
}

/* 전체 조회 */
export const getByUser = async (req, res, next) => {
  try {
    const list = await notificationService.getByUser(USER_ID, 50);
    res.json(list);
  } catch (err) {
    next(err);
  }
};

/* 단일 조회 */
export const getById = async (req, res, next) => {
  try {
    const item = await notificationService.getById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

/* 읽음 처리 */
export const markAsRead = async (req, res, next) => {
  try {
    const updated = await notificationService.markAsRead(req.params.id);
    res.json({ ok: true, updated });
  } catch (err) {
    next(err);
  }
};

/* 선택/전체 삭제 */
export const removeBulk = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const removed = await notificationService.removeMany(ids, USER_ID);
    res.json({ ok: true, removed });
  } catch (err) {
    next(err);
  }
};

/* 단일 삭제 */
export const remove = async (req, res, next) => {
  try {
    await notificationService.remove(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
