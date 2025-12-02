// --------------------------------------------------------
// apps/api/src/controllers/notificationController.js
// Notification Controller
// --------------------------------------------------------

import * as service from "../services/notificationService.js";

function getUserId(req) {
  return req.user?.id || Number(req.query.userId) || 1;
}

// 전체 조회
export const getList = async (req, res, next) => {
  try {
    const list = await service.getList(getUserId(req));
    res.json(list);
  } catch (err) {
    next(err);
  }
};

// 단일 조회
export const getById = async (req, res, next) => {
  try {
    const item = await service.getById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

// 생성
export const create = async (req, res, next) => {
  try {
    const item = await service.create({
      user_id: getUserId(req),
      title: req.body.title,
      message: req.body.message,
      type: req.body.type,
    });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

// 읽음 처리
export const markAsRead = async (req, res, next) => {
  try {
    const item = await service.markAsRead(req.params.id);
    res.json({ ok: true, item });
  } catch (err) {
    next(err);
  }
};

// 선택/전체 삭제
export const removeBulk = async (req, res, next) => {
  try {
    // 🔥 body에 ids 없으면 "all" 취급 (DELETE /notification/all)
    const ids = req.body?.ids ?? "all";
    const removed = await service.removeMany(ids, getUserId(req));
    res.json({ ok: true, removed });
  } catch (err) {
    next(err);
  }
};

// 단일 삭제
export const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
