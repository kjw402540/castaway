// src/services/reportService.js
import prisma from "../lib/prisma.js";

/* --------------------------------------------------------
   이번 주 리포트 조회 (가장 최근 생성된 것)
   - 메인 화면에 뿌려줄 때 사용
-------------------------------------------------------- */
export const getWeekly = async (userId) => {  
  // user_id가 숫자인지 확실하게 변환
  const uid = Number(userId);

  const result = await prisma.report.findFirst({
    where: { user_id: uid },
    orderBy: { created_date: "desc" },
  });
  return result;
};

/* --------------------------------------------------------
   전체 리포트 히스토리 조회
-------------------------------------------------------- */
export const getHistory = async (userId) => {
  return prisma.report.findMany({
    where: { user_id: Number(userId) },
    orderBy: { created_date: "desc" },
  });
};

/* --------------------------------------------------------
   단일 리포트 상세 조회
-------------------------------------------------------- */
export const getById = async (id) => {
  return prisma.report.findUnique({
    where: { report_id: Number(id) },
  });
};

/* --------------------------------------------------------
   ★ 핵심: 주간 리포트 생성 (Generate)
   - 특정 날짜를 받으면 그 주(월~일)의 데이터를 긁어와서 생성
-------------------------------------------------------- */
export const generateWeekly = async (userId, targetDate) => {
  // 1. 날짜 범위 계산 (월요일 00:00 ~ 일요일 23:59)
  const date = new Date(targetDate);
  const day = date.getDay(); // 0(일)~6(토)
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // 월요일 기준

  const startDate = new Date(date);
  startDate.setDate(diff);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  console.log(`[Report] 생성 범위: ${startDate.toISOString()} ~ ${endDate.toISOString()}`);

  // 2. 해당 기간의 EmotionResult(일기 분석 결과) 조회
  // 주의: prisma.schema에 EmotionResult -> Diary 관계가 연결되어 있어야 함
  const weeklyLogs = await prisma.emotionResult.findMany({
    where: {
      diary: {
        // [수정] 관계를 통해 user_id 조회 (가장 안전한 방법)
        user: {
          user_id: Number(userId),
        },
        // [수정] date 컬럼 없음 -> created_date 사용
        created_date: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
    select: {
      main_emotion: true,
      summary_text: true,
      diary: { 
        // [수정] date 컬럼 없음 -> created_date 선택
        select: { created_date: true } 
      },
    },
  });

  if (!weeklyLogs || weeklyLogs.length === 0) {
    throw new Error("해당 기간에 분석할 일기 데이터가 없습니다.");
  }

  const dailyHistory = [];
  const days = ["일", "월", "화", "수", "목", "금", "토"]; // JS Date.getDay() 기준

  // startDate부터 7일 반복
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    
    // 날짜 비교를 위해 YYYY-MM-DD 문자열 변환
    const dateStr = d.toISOString().split('T')[0];
    
    // 해당 날짜에 쓴 일기가 있는지 찾기
    const log = weeklyLogs.find(l => 
      // [수정] l.diary.date -> l.diary.created_date
      l.diary.created_date.toISOString().split('T')[0] === dateStr
    );

    dailyHistory.push({
      day: days[d.getDay()], // 월, 화, 수...
      date: dateStr,
      emotion: log ? log.main_emotion : null, // 없으면 null (중요!)
    });
  }

  // 3. AI 분석 요청
  const aiResult = await callAiAnalysisServer(weeklyLogs);

  // 4. DB 저장용 데이터 구성
  const emotionStats = calculateStats(weeklyLogs);
  const distributionData = {
    counts: emotionStats,
    keywords: aiResult.keywords, // AI가 뽑은 키워드
    daily_history: dailyHistory
  };

  const fullEncouragement = `[감정 변화 포인트]\n${aiResult.change_points}\n\n[다음 주 조언]\n${aiResult.prediction}`;

    // 5. [수정] 이미 존재하는 리포트인지 확인
  const existingReport = await prisma.report.findFirst({
    where: {
      user_id: Number(userId),
      start_date: startDate,
      end_date: endDate,
    },
  });

  if (existingReport) {
    // [UPDATE] 기존 리포트 업데이트
    console.log(`[Report] 기존 리포트(ID: ${existingReport.report_id}) 업데이트`);
    return prisma.report.update({
      where: { report_id: existingReport.report_id },
      data: {
        summary_text: aiResult.review,
        encouragement_text: fullEncouragement,
        emotion_distribution: distributionData,
        created_date: new Date(), // 업데이트 시점 갱신 (선택사항)
      },
    });
  } else {
    // [CREATE] 새 리포트 생성
    console.log(`[Report] 새 리포트 생성`);
    return prisma.report.create({
      data: {
        user_id: Number(userId),
        start_date: startDate,
        end_date: endDate,
        summary_text: aiResult.review,
        encouragement_text: fullEncouragement,
        emotion_distribution: distributionData,
      },
    });
  }
};


// ------------------------------------------------------------------
// AI 서버(Python)와 통신하는 진짜 함수 (fetch 버전)
// ------------------------------------------------------------------
const callAiAnalysisServer = async (logs) => {
  try {
    // 1. Python 서버가 원하는 모양으로 데이터 가공
    const formattedLogs = logs.map((log) => ({
      // [수정] log.diary.date -> log.diary.created_date
      date: log.diary.created_date.toISOString().split('T')[0], // YYYY-MM-DD
      emotion: log.main_emotion, 
      summary: log.summary_text || ""
    }));

    const payload = {
      logs: formattedLogs
    };

    console.log(`[AI Request] Python 서버로 ${formattedLogs.length}건 분석 요청...`);

    // 2. Python 서버 호출 (fetch 사용)
    const response = await fetch('http://127.0.0.1:8000/analyze/weekly', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log("[AI Response] 분석 완료!");
    return data; 

  } catch (e) {
    console.error("AI 서버 통신 실패:", e.message);
    
    // 실패 방어 로직
    return {
      keywords: ["분석지연"],
      change_points: "AI 서버 연결이 원활하지 않아 분석할 수 없습니다.",
      review: "잠시 후 다시 시도해주세요.",
      prediction: "서버 상태를 확인해주세요."
    };
  }
};

// 감정 통계 계산 (0~4)
const calculateStats = (logs) => {
  const counts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
  logs.forEach((log) => {
    if (log.main_emotion !== null && counts[log.main_emotion] !== undefined) {
      counts[log.main_emotion]++;
    }
  });
  return counts;
};