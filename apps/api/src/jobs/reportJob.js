// src/jobs/reportJob.js
import cron from 'node-cron';
import { generateWeekly } from '../services/reportService.js';
import prisma from '../lib/prisma.js';

export const initScheduledJobs = () => {
  // ✅ [수정 1] 타임존 옵션을 줘서 "한국 시간 월요일 00시"에 실행되게 함
  cron.schedule('0 0 * * 1', async () => {
    console.log('⏰ [Cron] 주간 리포트 자동 생성 시작 (KST 월요일 00:00)...');

    try {
      // 1. 사용자 ID 가져오기
      const users = await prisma.user.findMany({ select: { user_id: true } });
      
      // ✅ [수정 2] 날짜 계산을 더 안전하게!
      // 크론이 도는 시점(KST 월요일 00시)은 UTC로는 "일요일 오후 3시"임.
      // 그냥 new Date()를 쓰면 UTC 일요일이 잡힘 -> 하루 빼면 토요일이 됨.
      // (물론 토요일도 지난주라서 로직상 문제는 없지만, 명확하게 하기 위해)
      
      const now = new Date(); // 현재 서버 시간
      
      // 우리가 원하는 건 "지난주" 데이터.
      // generateWeekly 함수는 "입력된 날짜가 포함된 주"를 분석함.
      // 따라서 "어제(일요일)" 날짜를 넘겨주면 됨.
      
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() - 1); // 하루 전으로 설정
      
      console.log(`🎯 타겟 날짜(지난주 포함): ${targetDate.toISOString()} 근처`);

      // 3. 사용자별 생성
      for (const user of users) {
        // 로그 너무 많이 찍히면 서버 느려지니까 
        // console.log(`User ${user.user_id} 리포트 생성 중...`); 
        try {
            await generateWeekly(user.user_id, targetDate);
        } catch (e) {
            console.error(`❌ User ${user.user_id} 실패:`, e.message);
        }
      }
      
      console.log('✅ [Cron] 모든 주간 리포트 생성 작업 완료!');
      
    } catch (error) {
      console.error('🔥 [Cron] 스케줄러 치명적 에러:', error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Seoul" // 👈 이게 제일 중요!! (이거 없으면 아침 9시에 돔)
  });
};