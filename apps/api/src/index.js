import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import allRoutes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 4000;

// 미들웨어
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));

// RN/Expo에서 접근 가능하도록 CORS 허용
app.use(
  cors({
    origin: '*', // 필요 시 프론트 도메인/포트로 제한
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

// 헬스 체크
app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'castaway-api' });
});

// API 라우트
app.use('/api', allRoutes);

// 기본 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
});

// 0.0.0.0 바인딩으로 같은 LAN의 실기기/에뮬에서도 접근 가능
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API on :${PORT}`);
});
