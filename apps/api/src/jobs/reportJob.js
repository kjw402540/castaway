// src/jobs/reportJob.js
import cron from 'node-cron';
import { generateWeekly } from '../services/reportService.js';
import prisma from '../lib/prisma.js'; // 사용자 목록 가져오려고 필요

// 스케줄러 설정 함수
export const initScheduledJobs = () => {
  // 0분 0시 *일 *월 1요일(월요일)
  cron.schedule('0 0 * * 1', async () => {
    console.log('[Cron] 주간 리포트 자동 생성 시작...');

    try {
      // 1. 모든 사용자 ID 가져오기 (혹은 활성 사용자만)
      const users = await prisma.user.findMany({ select: { user_id: true } });
      
      // 2. 어제 날짜 구하기 (월요일 0시에 돌니까, 일요일까지의 데이터를 요약해야 함)
      // generateWeekly 함수가 '입력된 날짜가 포함된 주'를 찾으므로, 
      // 안전하게 '하루 전(일요일)' 날짜를 넣어주면 지난주 리포트가 됨.
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      // 3. 사용자별로 순차적으로(또는 병렬로) 생성
      for (const user of users) {
        console.log(`User ${user.user_id} 리포트 생성 중...`);
        try {
            await generateWeekly(user.user_id, yesterday);
        } catch (e) {
            console.error(`User ${user.user_id} 실패:`, e.message);
            // 한 명 실패해도 다음 사람은 계속 진행
        }
      }
      
      console.log('[Cron] 모든 리포트 생성 완료!');
      
    } catch (error) {
      console.error('[Cron] 스케줄러 에러:', error);
    }
  });
};