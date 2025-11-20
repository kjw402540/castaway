// src/mocks/reportMock.js

let mockHistory = [
  {
    weekStart: "2025-11-10",
    top3: [
      { emotion: "joy", count: 4 },
      { emotion: "sadness", count: 2 },
      { emotion: "neutral", count: 1 },
    ],
    summary: "이번 주는 기쁨이 가장 많았네요!",
  },
  {
    weekStart: "2025-11-03",
    top3: [
      { emotion: "neutral", count: 3 },
      { emotion: "anger", count: 2 },
      { emotion: "sadness", count: 1 },
    ],
    summary: "무난한 주였어요.",
  },
];

let mockWeekly = {
  weekStart: "2025-11-17",
  top3: [
    { emotion: "joy", count: 3 },
    { emotion: "sadness", count: 2 },
    { emotion: "neutral", count: 1 },
  ],
  summary: "기쁨이 많은 한 주였어요!",
  keywords: ["프로젝트", "피곤", "학원"],
  objects: ["🎁", "🎵"],
};

export const reportMock = {
  getWeeklyReport: async () =>
    new Promise((resolve) =>
      setTimeout(() => resolve(mockWeekly), 200)
    ),

  getHistory: async () =>
    new Promise((resolve) =>
      setTimeout(() => resolve(mockHistory), 200)
    ),

  saveReport: async (data) =>
    new Promise((resolve) => {
      mockHistory.unshift(data); // 최신 리포트 맨 앞으로
      setTimeout(() => resolve(true), 200);
    }),
};
