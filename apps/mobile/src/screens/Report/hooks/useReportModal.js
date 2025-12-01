// src/screens/Report/hooks/useReportModal.js

import { useState, useEffect } from "react";
import { getWeeklyReport } from "../../../services/reportService";

// 감정 ID 매핑 (백엔드 0~4 -> 프론트 UI 정보)
const EMOTION_MAP = {
  0: { label: "분노", icon: "😡", color: "#EF4444" },
  1: { label: "기쁨", icon: "😊", color: "#3B82F6" },
  2: { label: "중립", icon: "😐", color: "#9CA3AF" },
  3: { label: "슬픔", icon: "😭", color: "#60A5FA" },
  4: { label: "놀람", icon: "😲", color: "#EC4899" },
};

// 일기를 안 쓴 날 표시할 색상 (요청하신 색상)
const EMPTY_COLOR = "#5f5f60ff"; 

export function useReportModal() {
  // 초기 상태 (로딩 중일 때 UI가 안 깨지게 기본값 세팅)
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
    console.log("📡 [Front] 리포트 데이터 요청 시작...");
    
    try {
      const data = await getWeeklyReport();
      console.log("📦 [Front] 서버 응답 데이터:", data);

      // [핵심 수정] 데이터가 없거나(null), 비어있을 경우 처리
      if (!data) {
        console.warn("⚠️ [Front] 데이터가 없습니다. (아직 생성된 리포트 없음)");
        setReportData(prev => ({
          ...prev,
          summary: "아직 생성된 주간 리포트가 없습니다.",
          aiComment: "일기를 꾸준히 작성하면 매주 월요일에 리포트가 생성돼요!",
        }));
        return;
      }

      // 데이터가 있으면 변환 로직 수행
      const formatted = transformData(data);
      console.log("✨ [Front] 데이터 변환 완료:", formatted);
      setReportData(formatted);

    } catch (e) {
      console.error("❌ [Front] 에러 발생:", e);
      setReportData(prev => ({
        ...prev,
        summary: "리포트를 불러오는 데 실패했습니다.",
      }));
    }
  };

  return reportData;
}

// ----------------------------------------------------
// [Helper] 백엔드 데이터 -> 프론트엔드 포맷 변환기
// ----------------------------------------------------
function transformData(dbData) {
  // DB의 JSONB 컬럼 구조 분해
  const dist = dbData.emotion_distribution || {}; 
  const counts = dist.counts || {};
  const dailyHistory = dist.daily_history || []; // ★ 여기에 출석부가 들어있음

  // 1. Top 3 감정 계산
  const sortedEmotions = Object.entries(counts)
    .sort(([, a], [, b]) => b - a) // 값 내림차순 정렬
    .slice(0, 3); // 상위 3개

  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

  const top3 = sortedEmotions.map(([key, val]) => ({
    label: EMOTION_MAP[key]?.label || "기타",
    value: Math.round((val / totalCount) * 100),
  }));

  // 2. 메인 감정 설정
  const mainKey = sortedEmotions[0]?.[0] || 2; // 없으면 중립
  const mainEmotion = EMOTION_MAP[mainKey];

  // 3. 텍스트 파싱 (encouragement_text 분리)
  // DB 저장 포맷: "[감정 변화 포인트]\n내용...\n\n[다음 주 조언]\n내용..."
  const rawEncourage = dbData.encouragement_text || "";
  const splitText = rawEncourage.split("[다음 주 조언]");
  
  const changePointText = splitText[0]?.replace("[감정 변화 포인트]", "").trim() || "";
  const predictionText = splitText[1]?.trim() || "";

  // 4. [핵심 수정] Daily 그래프 데이터 생성
  // daily_history가 있으면 그걸 쓰고, 없으면(구버전 데이터) 빈 점 7개 생성
  let dailyData = [];
  
  if (dailyHistory.length > 0) {
    dailyData = dailyHistory.map((item) => {
      // item.emotion이 null이면 일기 안 쓴 날 -> EMPTY_COLOR
      const hasEmotion = item.emotion !== null && item.emotion !== undefined;
      const emotionInfo = hasEmotion ? EMOTION_MAP[item.emotion] : null;

      return {
        day: item.day, // "월", "화", ...
        color: emotionInfo ? emotionInfo.color : EMPTY_COLOR, 
      };
    });
  } else {
    // Fallback: 데이터가 아예 없을 경우 그냥 빈 회색 점 7개 표시
    const days = ["월", "화", "수", "목", "금", "토", "일"];
    dailyData = days.map(d => ({ day: d, color: EMPTY_COLOR }));
  }

  // 5. 리턴 객체 조립
  return {
    summary: dbData.summary_text || "데이터가 충분하지 않아요.", 
    
    thisWeek: {
      mainEmotion: mainEmotion,
      daily: dailyData, // 위에서 계산한 dailyData 적용
      top3: top3,
    },

    keywords: dist.keywords || [],

    // 줄바꿈 기준으로 리스트화
    changePoints: changePointText.split("\n").filter(t => t.length > 0),

    // 지난주 대비 데이터는 현재 DB에 없으므로 0 처리
    compare: {
      [top3[0]?.label || "기타"]: 0,
      [top3[1]?.label || "기타"]: 0,
      [top3[2]?.label || "기타"]: 0,
    },

    aiComment: dbData.summary_text, 

    prediction: predictionText.split("\n").filter(t => t.length > 0),
  };
}