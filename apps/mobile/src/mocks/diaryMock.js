// src/mocks/diaryMock.js

let diaryDB = {
  "2025-11-18": {
    date: "2025-11-18",
    text: "오늘은 앱 구조를 싹 갈아엎었다.",
    emotion: "neutral",
    keywords: ["앱", "수정"],
    object: null,
    audio: null,
  },
  "2025-11-19": {
    date: "2025-11-19",
    text: "어 없애버렸다",
    emotion: "neutral",
    keywords: [],
    object: null,
    audio: null,
  },
};

export const diaryMock = {
  getAll: async () =>
    new Promise((r) => setTimeout(() => r({ ...diaryDB }), 100)),

  getByDate: async (date) =>
    new Promise((r) => setTimeout(() => r(diaryDB[date] || null), 100)),

  save: async (data) =>
    new Promise((r) => {
      const { date, ...rest } = data;

      diaryDB[date] = {
        ...(diaryDB[date] || {}),
        ...rest,
        date,
      };

      setTimeout(() => r({ ...diaryDB }), 100);
    }),

  delete: async (date) =>
    new Promise((r) => {
      delete diaryDB[date];
      setTimeout(() => r({ ...diaryDB }), 100);
    }),
};
