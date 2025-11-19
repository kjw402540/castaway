// src/screens/Objects/ObjectsService.js

// 가데이터 (메모리 DB)
let objectDB = [
  {
    id: 1,
    name: "작은 모닥불",
    emotion: "joy",
    icon: "🔥",
    description: "따뜻한 감정을 상징하는 작은 불씨.",
  },
  {
    id: 2,
    name: "돌멩이",
    emotion: "neutral",
    icon: "🪨",
    description: "평온하고 안정적인 느낌.",
  },
  {
    id: 3,
    name: "바람종",
    emotion: "sadness",
    icon: "🎐",
    description: "슬픔이 바람에 스쳐 지나가는 이미지.",
  },
];

// 전체 목록 가져오기
export async function getAllObjects() {
  return [...objectDB];
}

// 단일 오브제
export async function getObjectById(id) {
  return objectDB.find((o) => o.id === id) || null;
}

// 추가 기능 (향후 확장 대비)
export async function addObject(newObj) {
  const nextId = objectDB.length + 1;
  const obj = { id: nextId, ...newObj };
  objectDB.push(obj);
  return obj;
}
