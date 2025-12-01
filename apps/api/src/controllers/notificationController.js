// src/controllers/notificationController.js

import * as notificationService from "../services/notificationService.js";

function getUserId(req) {
  return req.user?.id || Number(req.query.userId) || 1;
}

/** 알림 전체 조회 (Mail 포함)
 * GET /api/notification
 * GET /api/notification?type=3 → Mail만 조회
 */
export const getList = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { type } = req.query;

    const list = await notificationService.getList(userId, type);
    res.json(list);
  } catch (err) {
    next(err);
  }
};

/** 알림 단일 조회
 * GET /api/notification/:id
 */
export const getById = async (req, res, next) => {
  try {
    const item = await notificationService.getById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

/** 알림 생성 (Mail 포함)
 * POST /api/notification
 */
export const create = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { title, message, type } = req.body;

    const item = await notificationService.create({
      user_id: userId,
      title: title ?? "알림",
      message: message ?? "",
      type: type ?? 0,
    });

    res.json(item);
  } catch (err) {
    next(err);
  }
};

/** 읽음 처리 (PATCH /api/notification/:id/read) */
export const markAsRead = async (req, res, next) => {
  try {
    const updated = await notificationService.markAsRead(req.params.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/** 삭제 (DELETE /api/notification/:id) */
export const remove = async (req, res, next) => {
  try {
    await notificationService.remove(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
