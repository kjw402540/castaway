// =======================================
// DiaryService.js (with objects & audio)
// =======================================

const today = new Date().toISOString().split("T")[0];



let diaryDB = {
  "2025-11-18": {
    text: "오늘은 앱 구조를 싹 갈아엎었다. 그래도 꽤 잘 되어가고 있다.",
    emotion: "neutral",
    object: {
      name: "마이크",
      icon: require("../../../assets/objects/mic.png"),
    },
    keywords: ["앱", "수정"],
    audio: require("../../../assets/audio/sample_audio.wav"),
  },

  "2025-11-19": {
    text: "어 없애버렸다",
    emotion: "neutral",
    object: null,
    keywords: [],
    audio: null,
  },
};

// 전체 조회
export async function getAllDiaries() {
  return diaryDB;
}

// 특정 날짜조회
export async function getDiaryByDate(date) {
  return diaryDB[date] || null;
}

// 저장/수정
export async function saveDiary(date, text, emotion, object = null, keywords = [], audio = null) {
  diaryDB[date] = { text, emotion, object, keywords, audio };
  return true;
}

// 삭제
export async function deleteDiary(date) {
  delete diaryDB[date];
  return true;
}
