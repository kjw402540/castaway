// =======================================
// DiaryService.js (Updated / Clean Version)
// =======================================

// 임시 가데이터 (최근 날짜 중심)

const today = new Date().toISOString().split("T")[0];

let diaryDB = {
  "2025-11-18": {
    text: "오늘은 앱 구조를 싹 갈아엎었다. 그래도 꽤 잘 되어가고 있다.",
    emotion: "neutral",
  },
  "2025-11-19": {
    text: "섬 디자인이 마음에 들었다. 감정 데이터도 정리됨.",
    emotion: "joy",
  },
};

// 전체 조회 (캘린더 dot 용)
export async function getAllDiaries() {
  return diaryDB;
}

// 특정 날짜 조회
export async function getDiaryByDate(dateString) {
  return diaryDB[dateString] || null;
}

// 저장 (신규 or 덮어쓰기)
export async function saveDiary(dateString, text, emotion = "neutral") {
  diaryDB[dateString] = { text, emotion };
  return true;
}

// 삭제
export async function deleteDiary(dateString) {
  delete diaryDB[dateString];
  return true;
}
