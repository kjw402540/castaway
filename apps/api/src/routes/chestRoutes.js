import { Router } from 'express';

const router = Router();

// GET /v1/chests
router.get('/', (req, res) => {
  res.json({ message: '보물상자 목록 조회 (구현 예정)' });
});

export default router;