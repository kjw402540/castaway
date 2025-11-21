// src/mocks/profileMock.js
let mockProfile = {
  nickname: "가지볶음",
  email: "email@domain.com",
  bgm: false,
  effect: false,
  reminder: false,
  reminderTime: new Date().toISOString(),
};

export const profileMock = {
  getProfile: async () =>
    new Promise((r) => setTimeout(() => r(mockProfile), 300)),

  updateProfile: async (key, value) =>
    new Promise((r) => {
      mockProfile[key] = value;
      setTimeout(() => r(true), 200);
    }),
};
