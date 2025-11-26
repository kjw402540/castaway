// apps/api/test-db.js
import pg from 'pg';

// 네 .env에 있는 주소 그대로 가져옴
const connectionString = "postgresql://castaway:wilson@127.0.0.1:5555/castaway?schema=public";

const client = new pg.Client({
  connectionString,
});

async function testConnection() {
  try {
    console.log("📡 연결 시도 중...");
    await client.connect();
    console.log("✅ 연결 성공! DB 살아있음.");
    
    const res = await client.query('SELECT NOW()');
    console.log("⏰ 현재 DB 시간:", res.rows[0]);
    
    await client.end();
  } catch (err) {
    console.error("❌ 연결 실패 원인 분석:");
    console.error(err); // 여기서 진짜 에러 메시지가 나옴
  }
}

testConnection();