// src/domain/chest/ChestService.js

export const ChestService = {
  async fetchObjects() {
    return {
      Joy: [
        { id: 1, emoji: "🐻", diaryId: "2025-11-11" },
        {
          id: 2,
          image: require("../../../assets/objects/mic.png"),
          diaryId: "2025-11-11",
        },
      ],

      Sadness: [
        { id: 3, emoji: "🚲", diaryId: "2025-11-11" },
        { id: 4, emoji: "🌧️", diaryId: "2025-11-11" },
      ],

      Anger: [
        { id: 5, emoji: "💻", diaryId: "2025-11-11" },
        { id: 6, emoji: "🎤", diaryId: "2025-11-11" },
      ],
    };
  },
};
