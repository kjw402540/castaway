import { Router } from "express";

import authRoutes from "./authRoutes.js";
import diaryRoutes from "./diaryRoutes.js"; // 파일명 diary.js로 맞춤
import objectsRoutes from "./objectsRoutes.js";
import bgmRoutes from "./bgmRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/diary", diaryRoutes);
router.use("/object", objectsRoutes);
router.use("/bgm", bgmRoutes);
router.use("/user", userRoutes);

export default router;
