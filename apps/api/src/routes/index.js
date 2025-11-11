import { Router } from 'express';
import diaryRoutes from './diaryRoutes.js'; // ✅ 'diary'로 변경
import authRoutes from './authRoutes.js';
import turntableRoutes from './turntableRoutes.js';
import chestRoutes from './chestRoutes.js';

const router = Router();

// /v1 하위 경로들을 설정
router.use('/v1/auth', authRoutes);
router.use('/v1/diaries', diaryRoutes); // ✅ 'diary'로 변경
router.use('/v1/turntables', turntableRoutes);
router.use('/v1/chests', chestRoutes);

export default router;