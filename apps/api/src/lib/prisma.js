// lib/prisma.js
import { PrismaClient } from '@prisma/client';

// Prisma 7 환경에서는 withPgVector 불가, adapter 옵션도 필요 없음
const prisma = new PrismaClient();

export default prisma;
