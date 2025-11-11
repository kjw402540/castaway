import { Router } from 'express';

const router = Router();

// GET /v1/turntables
router.get('/', (req, res) => {
  res.json({ message: '턴테이블 목록 조회 (구현 예정)' });
});

export default router;