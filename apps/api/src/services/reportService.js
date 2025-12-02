import prisma from "../lib/prisma.js";

/* --------------------------------------------------------
   [Helper] UTC 타임스탬프를 한국 날짜 문자열(YYYY-MM-DD)로 변환
   - 서버 시간대와 상관없이 무조건 9시간을 더해서 한국 날짜를 뽑아냅니다.
-------------------------------------------------------- */
const toLocalYMD = (dateObj) => {
  const d = new Date(dateObj);
  // UTC 밀리초 + 9시간 (KST)
  const kstDate = new Date(d.getTime() + (9 * 60 * 60 * 1000));
  return kstDate.toISOString().split('T')[0];
};

/* --------------------------------------------------------
   [Helper] Date 객체에서 YYYY-MM-DD 추출 (로컬 기준)
-------------------------------------------------------- */
const getFormatDate = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/* --------------------------------------------------------
   이번 주 리포트 조회
-------------------------------------------------------- */
export const getWeekly = async (userId) => {  
  const uid = Number(userId);
  return await prisma.report.findFirst({
    where: { user_id: uid },
    orderBy: { created_date: "desc" },
  });
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
   - KST(한국 시간) 기준으로 정확하게 범위를 계산합니다.
-------------------------------------------------------- */
export const generateWeekly = async (userId, targetDate) => {
  // 1. 기준 날짜 잡기 (입력받은 날짜가 포함된 주의 월/일요일 계산)
  const tempDate = new Date(targetDate);
  const day = tempDate.getDay(); 
  const diff = tempDate.getDate() - day + (day === 0 ? -6 : 1);
  
  // 로컬 기준으로 월요일/일요일 날짜 객체 생성
  const startObj = new Date(tempDate);
  startObj.setDate(diff); // 월요일
  
  const endObj = new Date(startObj);
  endObj.setDate(startObj.getDate() + 6); // 일요일

  // 2. YYYY-MM-DD 문자열 확보
  const startStr = getFormatDate(startObj); // 예: "2025-11-24"
  const endStr = getFormatDate(endObj);     // 예: "2025-11-30"

  // 3. ✅ [만능 해결책] ISO 문자열에 '+09:00'을 붙여서 절대 시간 생성
  // 로컬 컴퓨터가 KST든 UTC든 상관없이, 무조건 "한국 시간 00시"를 가리키는 UTC 시간을 만듭니다.
  const queryStart = new Date(`${startStr}T00:00:00+09:00`);
  const queryEnd = new Date(`${endStr}T23:59:59.999+09:00`);

  console.log(`[Report] KST 기준 검색 범위: ${startStr} ~ ${endStr}`);
  // console.log(`[Report] 실제 DB 쿼리(UTC): ${queryStart.toISOString()} ~ ${queryEnd.toISOString()}`);

  // 4. DB 조회
  const weeklyLogs = await prisma.emotionResult.findMany({
    where: {
      diary: {
        user_id: Number(userId),
        created_date: {
          gte: queryStart,
          lte: queryEnd,
        },
        flag: 1, 
      },
    },
    select: {
      main_emotion: true,
      summary_text: true,
      diary: {
        select: { created_date: true },
      },
    },
  });

  // 5. 빈 날짜 채우기 (월~일)
  const dailyHistory = [];
  const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

  for (let i = 0; i < 7; i++) {
    // queryStart(월요일 00:00 KST) 기준으로 하루씩 더함
    const d = new Date(queryStart.getTime() + (i * 24 * 60 * 60 * 1000));
    
    // 비교할 때 무조건 toLocalYMD(한국날짜)로 변환해서 비교
    const targetYMD = toLocalYMD(d); 

    const log = weeklyLogs.find((l) => {
      // DB에서 가져온 UTC 날짜도 한국 날짜로 변환해서 비교
      return toLocalYMD(l.diary.created_date) === targetYMD;
    });

    dailyHistory.push({
      day: dayLabels[d.getDay()], 
      date: targetYMD,
      emotion: log ? log.main_emotion : null, 
    });
  }

  // 6. AI 분석 요청
  const aiResult = await callAiAnalysisServer(weeklyLogs);

  // 7. DB 저장용 데이터 구성
  const emotionStats = calculateStats(weeklyLogs);
  const distributionData = {
    counts: emotionStats,
    keywords: aiResult.keywords, // AI가 뽑은 키워드
    daily_history: dailyHistory
  };

  const fullEncouragement = `[감정 변화 포인트]\n${aiResult.change_points}\n\n[다음 주 조언]\n${aiResult.prediction}`;

  // 8. 이미 존재하는 리포트인지 확인 (저장할 때도 queryStart, queryEnd 사용)
  const existingReport = await prisma.report.findFirst({
    where: {
      user_id: Number(userId),
      start_date: queryStart,
      end_date: queryEnd,
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
        created_date: new Date(),
      },
    });
  } else {
    // [CREATE] 새 리포트 생성
    console.log(`[Report] 새 리포트 생성`);
    return prisma.report.create({
      data: {
        user_id: Number(userId),
        start_date: queryStart,
        end_date: queryEnd,
        summary_text: aiResult.review,
        encouragement_text: fullEncouragement,
        emotion_distribution: distributionData,
      },
    });
  }
};

// ------------------------------------------------------------------
// AI 서버(Python)와 통신하는 함수 (Safe Parsing 적용)
// ------------------------------------------------------------------
const callAiAnalysisServer = async (logs) => {
  try {
    // 1. Python 서버가 원하는 모양으로 데이터 가공
    const formattedLogs = logs.map((log) => ({
      // AI 서버로 보낼 때도 한국 날짜 문자열로 변환해서 보냄
      date: toLocalYMD(log.diary.created_date), 
      emotion: log.main_emotion, 
      summary: log.summary_text || ""
    }));

    const payload = {
      logs: formattedLogs
    };

    console.log(`[AI Request] Python 서버로 ${formattedLogs.length}건 분석 요청...`);

    // 2. Python 서버 호출
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

    // ⚠️ [수정] response.json() 대신 text()로 원본을 받아서 직접 파싱합니다.
    const rawText = await response.text();
    
    // console.log("[AI Raw Response]", rawText); // 디버깅 필요시 주석 해제

    let data;
    try {
      // ✅ JSON 추출 로직 (AI가 앞뒤로 헛소리를 붙여도 JSON만 발라냄)
      const firstBrace = rawText.indexOf('{');
      const lastBrace = rawText.lastIndexOf('}');

      if (firstBrace !== -1 && lastBrace !== -1) {        
        const jsonString = rawText.substring(firstBrace, lastBrace + 1);
        data = JSON.parse(jsonString);
      } else {
        throw new Error("응답에 JSON 형식이 없습니다.");
      }
    } catch (parseError) {
      console.error("JSON 파싱 에러:", parseError);
      throw new Error("AI 응답 데이터 형식이 올바르지 않습니다.");
    }
    
    console.log("[AI Response] 분석 완료!");
    return data; 

  } catch (e) {
    console.error("AI 서버 통신 실패:", e.message);
    
    // 실패 방어 로직 (기본값 반환)
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