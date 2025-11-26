// src/controllers/clusterController.js
import * as clusterService from "../services/clusterService.js";

/* --------------------------------------------------------
   모든 클러스터
-------------------------------------------------------- */
export const getAll = async (req, res, next) => {
  try {
    const list = await clusterService.getAll();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

/* --------------------------------------------------------
   특정 클러스터
-------------------------------------------------------- */
export const getById = async (req, res, next) => {
  try {
    const cluster = await clusterService.getById(req.params.id);
    res.json(cluster);
  } catch (err) {
    next(err);
  }
};
