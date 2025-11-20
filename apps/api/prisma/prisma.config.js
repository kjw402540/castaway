// prisma.config.js

// .env 파일을 로드하여 process.env에 접근 가능하게 합니다.
module.exports = {
  // Prisma CLI가 마이그레이션 시 필요한 datasources 속성
  datasources: {
    db: {
      provider: 'postgresql',
      // 🚨 DATABASE_URL을 사용합니다.
      url: process.env.DATABASE_URL, 
    },
  },
};