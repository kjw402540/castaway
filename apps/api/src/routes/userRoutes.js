import { Router } from "express";
import * as controller from "../controllers/userController.js";

const router = Router();

// 회원가입 / 로그인
router.post("/register", controller.register);
router.post("/login", controller.login);

// 프로필
router.get("/profile", controller.getProfile);
router.patch("/profile", controller.updateProfile);

// 계정 삭제
router.delete("/delete", controller.deleteAccount);

// 클러스터 자동 업데이트
router.post("/cluster-sync", controller.syncCluster);

// 알림 설정 조회 / 수정
router.get("/noti", controller.getNotificationSettings);
router.patch("/noti", controller.updateNotificationSettings);

// 보고서 조회
router.get("/report", controller.getReport);

// 기존
router.get("/me", controller.me);
router.patch("/settings", controller.updateSettings);

export default router;
