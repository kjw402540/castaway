import * as clusterService from "../services/clusterService.js";

export const getAll = async (req, res, next) => {
  try {
    const list = await clusterService.getAll();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const cluster = await clusterService.getById(Number(req.params.id));
    res.json(cluster);
  } catch (err) {
    next(err);
  }
};
