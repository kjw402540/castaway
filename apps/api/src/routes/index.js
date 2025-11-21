import { Router } from 'express';

import diaryRoutes from './diaryRoutes.js';
import objectRoutes from './objectRoutes.js';
import bgmRoutes from './bgmRoutes.js';
import reportRoutes from './reportRoutes.js';
import emotionRoutes from './emotionRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import userRoutes from './userRoutes.js';
import clusterRoutes from './clusterRoutes.js';  // ★ 내부용도 그냥 붙임

const router = Router();

router.use('/diary', diaryRoutes);
router.use('/object', objectRoutes);
router.use('/bgm', bgmRoutes);
router.use('/report', reportRoutes);
router.use('/emotion', emotionRoutes);
router.use('/notification', notificationRoutes);
router.use('/user', userRoutes);

// 내부용 클러스터도 그냥 붙이자
router.use('/cluster', clusterRoutes);

export default router;
