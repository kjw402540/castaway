// src/services/DiaryService.js
// Fake API layer - 나중에 백엔드 붙이면 여기만 교체하면 됨.

let diaryDB = {
  "2025-11-11": {
    text: "아니 후시 시간을 무슨 12시간을 잡아놨다...",
    object: require("../../../assets/objects/mic.png"), 
  },
};

export async function fetchDiary(date) {
  await delay(120);
  return diaryDB[date] || null;
}

export async function saveDiaryService(date, text, object = null) {
  await delay(120);
  diaryDB[date] = { text, object };
  return true;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
