// ReportService.js

export function getWeeklyReport() {
  return {
    summary: "이번 주 당신의 감정은 안정과 회복에 가까웠어요.",

    emotionChange:
      "중반 이후 기쁨 비율이 증가하며 전체적으로 감정 진폭이 줄어든 한 주였어요.",

    thisWeek: {
      top3: [
        { label: "기쁨", value: 40, color: "#60A5FA" },
        { label: "중립", value: 30, color: "#9CA3AF" },
        { label: "슬픔", value: 15, color: "#F472B6" },
      ],

      daily: [
        { day: "월", emo: "분노", color: "#EF4444" },
        { day: "화", emo: "분노", color: "#EF4444" },
        { day: "수", emo: "중립", color: "#6B7280" },
        { day: "목", emo: "기쁨", color: "#60A5FA" },
        { day: "금", emo: "중립", color: "#6B7280" },
        { day: "토", emo: "슬픔", color: "#F472B6" },
        { day: "일", emo: "기쁨", color: "#60A5FA" },
      ],
    },

    lastWeek: {
      top3: [
        { label: "중립", value: 42 },
        { label: "기쁨", value: 25 },
        { label: "슬픔", value: 20 },
      ],
    },

    keywords: ["후시녹음", "작업실"],

    aiComment:
      "지난주보다 기쁨이 증가했고 전체 감정의 진폭이 줄었어요. 안정적으로 회복 중인 흐름입니다.",
  };
}
