// src/routes/clusterRoutes.js
import express from "express";
import * as clusterController from "../controllers/clusterController.js";

const router = express.Router();

/* --------------------------------------------------------
   기존 라우트
-------------------------------------------------------- */
// GET /api/cluster - 모든 클러스터 조회
router.get("/", clusterController.getAll);

// GET /api/cluster/:id - 특정 클러스터 조회
router.get("/:id", clusterController.getById);

/* --------------------------------------------------------
   새로운 라우트 (AI 클러스터링)
-------------------------------------------------------- */
// POST /api/cluster/update - 사용자 클러스터 업데이트
router.post("/update", clusterController.updateUserCluster);

// GET /api/cluster/user/:user_id - 사용자 클러스터 정보 조회
router.get("/user/:user_id", clusterController.getUserCluster);

export default router;