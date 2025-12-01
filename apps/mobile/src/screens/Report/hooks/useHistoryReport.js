// src/hooks/useHistoryReport.js
import { useState, useEffect } from "react";
import { getHistoryReports } from "../../../services/reportService";

// ✅ [수정] 색상표 통일
const EMOTION_COLOR = {
  0: "#EF4444", // 분노 (Red)
  1: "#F59E0B", // 기쁨 (Yellow/Amber) 👈 여기 수정함!
  2: "#10B981", // 중립 (Green)
  3: "#3B82F6", // 슬픔 (Blue)
  4: "#8B5CF6", // 놀람 (Purple)
};

const EMOTION_LABEL = {
  0: "분노", 1: "기쁨", 2: "중립", 3: "슬픔", 4: "놀람"
};

export function useHistoryReport() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getHistoryReports();
        
        const formatted = data.map((item) => {
          const dateObj = new Date(item.start_date);
          const year = dateObj.getFullYear();
          const week = getWeekNumber(dateObj); 
          
          const counts = item.emotion_distribution?.counts || {};
          const mainKey = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, 2);

          return {
            id: item.report_id,
            year: year,
            week: week,
            mainEmotion: EMOTION_LABEL[mainKey],
            trend: "?", 
            color: EMOTION_COLOR[mainKey],
          };
        });
        setHistory(formatted);
      } catch (e) {
        // console.error(e); // 에러 로그도 일단 끔
      }
    }
    load();
  }, []);

  return history;
}

// 주차 계산 헬퍼 (그대로 유지)
function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return weekNo;
}