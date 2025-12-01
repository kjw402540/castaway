// src/hooks/useHistoryReport.js
import { useState, useEffect } from "react";
import { getHistoryReports } from "../../../services/reportService";

const EMOTION_COLOR = {
  0: "#EF4444", // 분노
  1: "#3B82F6", // 기쁨
  2: "#9CA3AF", // 중립
  3: "#60A5FA", // 슬픔
  4: "#EC4899", // 놀람
};

const EMOTION_LABEL = {
  0: "분노", 1: "기쁨", 2: "중립", 3: "슬픔", 4: "놀람"
};

export function useHistoryReport() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getHistoryReports();
      // DB 데이터를 UI List 포맷으로 변환
      const formatted = data.map((item) => {
        // start_date를 파싱해서 몇 월 몇 주차인지 계산
        const dateObj = new Date(item.start_date);
        const year = dateObj.getFullYear();
        // 간단하게 주차 계산 (혹은 DB에서 주차를 받아오는 게 좋음)
        const week = getWeekNumber(dateObj); 
        
        // 메인 감정 찾기 (counts 중 가장 큰 값)
        const counts = item.emotion_distribution?.counts || {};
        const mainKey = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, 2);

        return {
          id: item.report_id, // 네비게이션용 ID
          year: year,
          week: week,
          mainEmotion: EMOTION_LABEL[mainKey],
          trend: "?", // 트렌드 데이터 없음
          color: EMOTION_COLOR[mainKey],
        };
      });
      setHistory(formatted);
    }
    load();
  }, []);

  return history;
}

// 주차 계산 헬퍼
function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return weekNo;
}