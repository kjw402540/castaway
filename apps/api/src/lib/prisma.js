// src/lib/prisma.js
import { PrismaClient } from '@prisma/client';

// 전역 변수에 저장된 prisma 인스턴스가 있는지 확인
const globalForPrisma = global;

// 이미 있으면 그거 쓰고, 없으면 새로 만듦
const prisma = globalForPrisma.prisma || new PrismaClient();

// 개발 모드일 때만 전역 변수에 저장 (프로덕션에서는 매번 새로 만드는 게 나을 수도 있음)
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;