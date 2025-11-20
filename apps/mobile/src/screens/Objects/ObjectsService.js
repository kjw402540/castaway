// =======================================
// ObjectsService.js
// =======================================

// 임시 mock 데이터 (API 생기면 여기만 교체하면 됨)
let objectsDB = [
  // Joy
  {
    id: "1",
    emotion: "joy",
    icon: "🔥",
    acquiredAt: "2025-11-19",
  },
  {
    id: "4",
    emotion: "joy",
    icon: "🐻",
    acquiredAt: "2025-11-17",
  },
  {
    id: "8",
    emotion: "joy",
    icon: "🎈",
    acquiredAt: "2025-11-18",
  },
  {
    id: "10",
    emotion: "joy",
    icon: "🌸",
    acquiredAt: "2025-11-15",
  },

  // Sadness
  {
    id: "3",
    emotion: "sadness",
    icon: "🎐",
    acquiredAt: "2025-11-19",
  },
  {
    id: "11",
    emotion: "sadness",
    icon: "🌧️",
    acquiredAt: "2025-11-16",
  },
  {
    id: "12",
    emotion: "sadness",
    icon: "💧",
    acquiredAt: "2025-11-14",
  },
];

// 전체 가져오기
export async function getAllObjects() {
  return objectsDB;
}

// 삭제
export async function deleteObject(id) {
  objectsDB = objectsDB.filter((o) => o.id !== id);
  return true;
}
