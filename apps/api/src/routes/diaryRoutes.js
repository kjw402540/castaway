import { Router } from 'express';
import { createDiary, getDiaries } from '../controllers/diaryController.js';

const router = Router();

// 텍스트만 받음 (JSON body)
router.post('/', createDiary);
router.get('/', getDiaries);

export default router;
