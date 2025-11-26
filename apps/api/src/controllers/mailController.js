import * as mailService from "../services/mailService.js";

const USER_ID = 1;

export const getAll = async (req, res, next) => {
  try {
    const list = await mailService.getAll(USER_ID);
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const saved = await mailService.create({
      ...req.body,
      user_id: USER_ID
    });
    res.json(saved);
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    await mailService.markAsRead(Number(req.params.id));
    res.json(true);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await mailService.remove(Number(req.params.id));
    res.json(true);
  } catch (err) {
    next(err);
  }
};

export const removeSelected = async (req, res, next) => {
  try {
    const ids = req.body.ids || [];
    for (const id of ids) {
      await mailService.remove(Number(id));
    }
    res.json(true);
  } catch (err) {
    next(err);
  }
};
