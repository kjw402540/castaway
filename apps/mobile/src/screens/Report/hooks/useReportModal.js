import { useState, useEffect } from "react";
import { getWeeklyReport } from "../../../services/reportService";

const EMOTION_MAP = {
  0: { label: "분노", icon: "😡", color: "#EF4444" },
  1: { label: "기쁨", icon: "😊", color: "#F59E0B" },
  2: { label: "평온", icon: "😐", color: "#10B981" },
  3: { label: "슬픔", icon: "😭", color: "#3B82F6" },
  4: { label: "놀람", icon: "😲", color: "#8B5CF6" },
};

const EMPTY_COLOR = "#5f5f60"; 

export function useReportModal(targetDate = null) {
  const [reportData, setReportData] = useState({
    summary: "리포트를 불러오는 중입니다...",
    thisWeek: {
      mainEmotion: { label: "분석중", icon: "..." },
      daily: [],
      top3: [],
    },
    keywords: [],
    changePoints: [],
    compare: {},
    aiComment: "",
    prediction: [],
  });

  // ✅ [중요] targetDate가 변경될 때마다 실행됨
  useEffect(() => {
    fetchData(targetDate);
  }, [targetDate]);

  const fetchData = async (date) => {
    try {
      // API 호출 (date가 null이면 백엔드에서 오늘 기준으로 처리하거나, 여기서 오늘 날짜를 보내도 됨)
      const data = await getWeeklyReport(date);

      if (!data) {
        setReportData(prev => ({
          ...prev,
          summary: "해당 기간의 리포트가 없습니다.",
          aiComment: "일기를 작성하면 리포트가 생성됩니다.",
          thisWeek: { ...prev.thisWeek, daily: [] } // 로딩 해제용 빈 배열
        }));
        return;
      }

      const formatted = transformData(data);
      setReportData(formatted);

    } catch (e) {
      console.error(e);
      setReportData(prev => ({
        ...prev,
        summary: "리포트를 불러오지 못했습니다.",
      }));
    }
  };

  return reportData;
}

// ----------------------------------------------------
// [Helper] 데이터 변환기 (수정됨)
// ----------------------------------------------------
function transformData(dbData) {
  const dist = dbData.emotion_distribution || {}; 
  const counts = dist.counts || {};
  const dailyHistory = dist.daily_history || []; 
  
  // ✅ [수정] 백엔드에서 받은 비교 데이터 (없으면 빈 객체)
  const serverCompare = dist.compare || {}; 

  // 1. Top 3 계산
  const sortedEmotions = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

  const top3 = sortedEmotions.map(([key, val]) => ({
    key: key, // ✅ [중요] 감정 ID(0~4)를 저장해야 비교 데이터를 찾을 수 있음
    label: EMOTION_MAP[key]?.label || "기타",
    value: Math.round((val / totalCount) * 100),
  }));

  // 2. 메인 감정
  const mainKey = sortedEmotions[0]?.[0] || 2; 
  const mainEmotion = EMOTION_MAP[mainKey];

  // 3. 텍스트 파싱
  const rawEncourage = dbData.encouragement_text || "";
  const splitText = rawEncourage.split("[다음 주 조언]");
  const changePointText = splitText[0]?.replace("[감정 변화 포인트]", "").trim() || "";
  const predictionText = splitText[1]?.trim() || "";

  // 4. Daily 그래프
  let dailyData = [];
  if (dailyHistory.length > 0) {
    dailyData = dailyHistory.map((item) => {
      const hasEmotion = item.emotion !== null && item.emotion !== undefined;
      const color = hasEmotion ? (EMOTION_MAP[item.emotion]?.color || EMPTY_COLOR) : EMPTY_COLOR;
      return {
        day: item.day,
        color: color, 
      };
    });
  } else {
    const days = ["월", "화", "수", "목", "금", "토", "일"];
    dailyData = days.map(d => ({ day: d, color: EMPTY_COLOR }));
  }

  // ✅ [수정] 지난주 대비 변화 데이터 매핑
  // (기존에는 0으로 하드코딩 되어 있었음)
  const compareData = {};
  top3.forEach(item => {
    // serverCompare['1'] -> 기쁨의 변화량 (+20 등)
    // 값이 없으면 0 처리
    compareData[item.label] = serverCompare[item.key] || 0;
  });

  return {
    summary: dbData.summary_text || "데이터가 충분하지 않아요.", 
    thisWeek: {
      mainEmotion: mainEmotion,
      daily: dailyData,
      top3: top3,
    },
    keywords: dist.keywords || [],
    changePoints: changePointText.split("\n").filter(t => t.length > 0),
    
    // ✅ 수정된 비교 데이터 연결
    compare: compareData, 

    aiComment: dbData.summary_text, 
    prediction: predictionText.split("\n").filter(t => t.length > 0),
  };
}