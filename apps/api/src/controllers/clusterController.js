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

/* --------------------------------------------------------
   사용자 클러스터 업데이트
   POST /api/cluster/update
   Body: { user_id: number }
-------------------------------------------------------- */
export const updateUserCluster = async (req, res, next) => {
  try {
    const { user_id } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }
    
    const result = await clusterService.updateUserCluster(user_id);
    res.json(result);
    
  } catch (err) {
    next(err);
  }
};

/* --------------------------------------------------------
   사용자의 현재 클러스터 정보 조회
   GET /api/cluster/user/:user_id
-------------------------------------------------------- */
export const getUserCluster = async (req, res, next) => {
  try {
    const user_id = parseInt(req.params.user_id);
    
    if (!user_id || isNaN(user_id)) {
      return res.status(400).json({ message: "Invalid user_id" });
    }
    
    const result = await clusterService.getUserCluster(user_id);
    res.json(result);
    
  } catch (err) {
    next(err);
  }
};