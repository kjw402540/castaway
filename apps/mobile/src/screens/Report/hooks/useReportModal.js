import { useState } from "react";

export function useReportModal() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // 상세 모달
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);

  // 예시: summary, AI comment, emotion values
  const [summary, setSummary] = useState("이번 주 당신의 감정은 평온함에 가까웠어요.");
  const [aiComment, setAiComment] = useState(
    "지난주보다 감정의 기복이 줄었고, 특히 중립 상태가 많았습니다.\n휴식이 잘 이루어지고 있는 한 주로 보이네요."
  );
  const [emotions, setEmotions] = useState(["기쁨", "슬픔", "분노", "놀람", "중립"]);
  const [values, setValues] = useState([40, 15, 10, 5, 30]);

  const openDetail = (month) => {
    setSelectedMonth(month);
    setDetailModalVisible(true);
    // 필요하면 여기서 데이터 fetch 가능
  };

  return {
    selectedMonth,
    setSelectedMonth,
    isDetailModalVisible,
    setDetailModalVisible,
    summary,
    aiComment,
    emotions,
    values,
    openDetail,
  };
}
