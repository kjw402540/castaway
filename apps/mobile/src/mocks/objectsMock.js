// src/mocks/objectsMock.js
let TEMP_DB = [
  {
    id: "1",
    type: "object",
    emotion: "Joy",
    emoji: "🎁",
    date: "2025-11-19",
  },
  {
    id: "2",
    type: "music",
    emotion: "Joy",
    emoji: "🎵",
    audioUri: require("../../assets/audio/sample_audio.wav"),
    date: "2025-11-18",
  },

  {
    id: "3",
    type: "object",
    emotion: "Sadness",
    emoji: "🌧️",
    date: "2025-11-17",
  },
  {
    id: "4",
    type: "music",
    emotion: "Sadness",
    emoji: "🎧",
    audioUri: require("../../assets/audio/sample_audio.wav"),
    date: "2025-11-16",
  },

  {
    id: "5",
    type: "object",
    emotion: "Anger",
    emoji: "💢",
    date: "2025-11-19",
  },
  {
    id: "6",
    type: "object",
    emotion: "Neutral",
    emoji: "🪨",
    date: "2025-11-17",
  },
  {
    id: "7",
    type: "music",
    emotion: "Fear",
    emoji: "👻",
    audioUri: require("../../assets/audio/sample_audio.wav"),
    date: "2025-11-15",
  },
];

export const objectsMock = {
  getAll: async () =>
    new Promise((r) => setTimeout(() => r(TEMP_DB), 200)),

  create: async (item) =>
    new Promise((r) => {
      TEMP_DB.push(item);
      setTimeout(() => r(true), 200);
    }),

  delete: async (id) =>
    new Promise((r) => {
      TEMP_DB = TEMP_DB.filter((i) => i.id !== id);
      setTimeout(() => r(true), 200);
    }),
};
