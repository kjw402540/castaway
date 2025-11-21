// src/mocks/diaryMock.js

let diaryDB = {
  "2025-11-18": {
    text: "오늘은 앱 구조를 싹 갈아엎었다.",
    emotion: "neutral",
    object: null,
    keywords: ["앱", "수정"],
    audio: null,
  },
  "2025-11-19": {
    text: "어 없애버렸다",
    emotion: "neutral",
    object: null,
    keywords: [],
    audio: null,
  },
};

export const diaryMock = {
  getAll: async () =>
    new Promise((r) => setTimeout(() => r(diaryDB), 200)),

  getByDate: async (date) =>
    new Promise((r) =>
      setTimeout(() => r(diaryDB[date] || null), 200)
    ),

  save: async (date, data) =>
    new Promise((r) => {
      diaryDB[date] = data;
      setTimeout(() => r(true), 200);
    }),

  delete: async (date) =>
    new Promise((r) => {
      delete diaryDB[date];
      setTimeout(() => r(true), 200);
    }),
};
