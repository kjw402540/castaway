import { PrismaClient } from '@prisma/client';
import { withPgVector } from 'prisma-extension-pgvector'; // pgvector 익스텐션 임포트

// 1. 기본 PrismaClient 인스턴스를 생성합니다.
const prismaBase = new PrismaClient();

// 2. withPgVector 익스텐션을 사용하여 클라이언트를 확장합니다.
const prisma = prismaBase.$extends(withPgVector());

// 3. 확장된 클라이언트를 내보냅니다.
export default prisma;