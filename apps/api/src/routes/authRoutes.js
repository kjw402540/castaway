import { Router } from 'express';

const router = Router();

// POST /v1/auth/register
router.post('/register', (req, res) => {
  res.json({ message: '회원가입 (구현 예정)' });
});

// POST /v1/auth/login
router.post('/login', (req, res) => {
  res.json({ message: '로그인 (구현 예정)' });
});

export default router;