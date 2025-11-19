// src/screens/Music/MusicService.js

// 가데이터 (앱 확장 시 API 연동 가능)
let musicDB = [
  {
    id: 1,
    title: "Ocean Breeze",
    emotion: "calm",
    duration: "2:45",
    icon: "🌊",
    description: "잔잔한 파도 소리와 함께 마음이 안정되는 음악.",
  },
  {
    id: 2,
    title: "Sunny Morning",
    emotion: "joy",
    duration: "3:10",
    icon: "☀️",
    description: "산뜻한 햇살 느낌의 밝은 배경 음악.",
  },
  {
    id: 3,
    title: "Moonlight",
    emotion: "sadness",
    duration: "2:56",
    icon: "🌙",
    description: "고요한 밤하늘 아래에서 듣기 좋은 차분한 곡.",
  },
];

// 전체 음악 목록
export async function getAllMusic() {
  return [...musicDB];
}

// ID로 음악 조회
export async function getMusicById(id) {
  return musicDB.find((m) => m.id === id) || null;
}

// 음악 추가
export async function addMusic(newItem) {
  const nextId = musicDB.length + 1;
  const music = { id: nextId, ...newItem };
  musicDB.push(music);
  return music;
}
