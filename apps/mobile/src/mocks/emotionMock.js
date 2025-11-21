// src/mocks/emotionMock.js

export const emotionMock = {
  analyze: (text) =>
    Promise.resolve({
      emotion: "기쁨",
      keywords: ["테스트", "샘플"],
      object: { icon: null },
      audio: null,
    }),
};
