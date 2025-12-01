// src/screens/Report/hooks/useReportModal.js

import { useState, useEffect } from "react";
import { getWeeklyReport } from "../../../services/reportService";

// ✅ [수정] 색상표 정상화 (기쁨=노랑 / 슬픔=파랑)
const EMOTION_MAP = {
  0: { label: "분노", icon: "😡", color: "#EF4444" }, // Red
  1: { label: "기쁨", icon: "😊", color: "#F59E0B" }, // Amber (노랑) 👈 여기가 파랑이어서 문제였음!
  2: { label: "평온", icon: "😐", color: "#10B981" }, // Emerald (초록)
  3: { label: "슬픔", icon: "😭", color: "#3B82F6" }, // Blue
  4: { label: "놀람", icon: "😲", color: "#8B5CF6" }, // Violet (보라)
};

// 요청하신 빈 데이터 색상 (진한 회색)
const EMPTY_COLOR = "#5f5f60"; 

export function useReportModal() {
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // console.log 삭제 (조용히 실행)
    try {
      const data = await getWeeklyReport();

      if (!data) {
        setReportData(prev => ({
          ...prev,
          summary: "아직 생성된 주간 리포트가 없습니다.",
          aiComment: "일기를 꾸준히 작성하면 매주 월요일에 리포트가 생성돼요!",
        }));
        return;
      }

      const formatted = transformData(data);
      setReportData(formatted);

    } catch (e) {
      // 에러 로그는 남겨두는 게 좋지만 원하면 지워도 됨
      // console.error("Report Error:", e);
      setReportData(prev => ({
        ...prev,
        summary: "리포트를 불러오는 데 실패했습니다.",
      }));
    }
  };

  return reportData;
}

// ----------------------------------------------------
// [Helper] 변환기
// ----------------------------------------------------
function transformData(dbData) {
  const dist = dbData.emotion_distribution || {}; 
  const counts = dist.counts || {};
  const dailyHistory = dist.daily_history || []; 

  // 1. Top 3
  const sortedEmotions = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

  const top3 = sortedEmotions.map(([key, val]) => ({
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

  // 4. Daily 그래프 (색상 매핑)
  let dailyData = [];
  if (dailyHistory.length > 0) {
    dailyData = dailyHistory.map((item) => {
      // emotion이 null이면 일기 안 쓴 날
      const hasEmotion = item.emotion !== null && item.emotion !== undefined;
      // hasEmotion이 true면 EMOTION_MAP에서 색 꺼내고, 아니면 EMPTY_COLOR
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

  return {
    summary: dbData.summary_text || "데이터가 충분하지 않아요.", 
    thisWeek: {
      mainEmotion: mainEmotion,
      daily: dailyData,
      top3: top3,
    },
    keywords: dist.keywords || [],
    changePoints: changePointText.split("\n").filter(t => t.length > 0),
    compare: {
      [top3[0]?.label || "기타"]: 0,
      [top3[1]?.label || "기타"]: 0,
      [top3[2]?.label || "기타"]: 0,
    },
    aiComment: dbData.summary_text, 
    prediction: predictionText.split("\n").filter(t => t.length > 0),
  };
}