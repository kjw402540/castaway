export function useReportModal() {
  return {
    summary: "이번 주 당신의 감정은 안정과 회복에 가까웠어요.",

    thisWeek: {
      mainEmotion: { label: "기쁨", icon: "😊" },
      daily: [
        { day: "월", color: "#EF4444" },
        { day: "화", color: "#F87171" },
        { day: "수", color: "#3B82F6" },
        { day: "목", color: "#9CA3AF" },
        { day: "금", color: "#3B82F6" },
        { day: "토", color: "#EC4899" },
        { day: "일", color: "#60A5FA" },
      ],
      top3: [
        { label: "기쁨", value: 40 },
        { label: "중립", value: 30 },
        { label: "슬픔", value: 15 },
      ],
    },

    keywords: ["후시녹음", "작업실", "집중", "회복"],

    changePoints: [
      "수요일에 피곤함 감소 → 중립 증가",
      "금요일에 성취감 증가 → 기쁨 상승",
      "주말에 스트레스 감소 흐름 관측",
    ],

    compare: {
      기쁨: 15,
      중립: -12,
      슬픔: -5,
    },

    aiComment:
      "지난주보다 기쁨이 증가했고 전체 감정의 진폭이 줄었어요. 안정적으로 회복 중인 흐름입니다.",

    prediction: [
      "초반에는 중립이 유지될 가능성이 높습니다.",
      "수요일 이후 기쁨이 다시 증가할 가능성이 있습니다.",
      "피로 누적만 조심하면 전반적으로 긍정적인 흐름이 유지될 예정이에요.",
    ],
  };
}
