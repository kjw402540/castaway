import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = 4000;

app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'castaway-api' });
});

app.post('/v1/entries', async (req, res, next) => {
  try {
    const { text, summary, keywords } = req.body;
    const created = await prisma.entry.create({
      data: { text, summary, keywords }
    });
    res.json(created);
  } catch (e) {
    next(e);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API on :${PORT}`);
});
