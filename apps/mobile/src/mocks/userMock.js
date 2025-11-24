// src/mocks/userMock.js

let TEMP_USER = {
  nickname: "윌슨",
  bio: "오늘도 나의 섬을 여행 중...",
  birth: "1997-03-13",
  email: "test@example.com",
};

export const userMock = {
  get: async () =>
    new Promise((r) => setTimeout(() => r(TEMP_USER), 200)),

  update: async (data) =>
    new Promise((r) => {
      TEMP_USER = { ...TEMP_USER, ...data };
      setTimeout(() => r(TEMP_USER), 200);
    }),

  logout: async () =>
    new Promise((r) => setTimeout(() => r(true), 200)),

  delete: async () =>
    new Promise((r) => {
      TEMP_USER = null;
      setTimeout(() => r(true), 200);
    }),
};
