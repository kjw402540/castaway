// src/domain/diary/DiaryService.js

let diaryDB = {
  "2025-11-11": {
    text: "아니 후시 시간을 무슨 12시간을 잡아놨다...",
    object: require("../../../assets/objects/mic.png"),
  },
};

export async function getDiary(date) {
  await delay(100);
  return diaryDB[date] || null;
}

export async function saveDiary(date, text, object = null) {
  await delay(100);
  diaryDB[date] = { text, object };
  return true;
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
