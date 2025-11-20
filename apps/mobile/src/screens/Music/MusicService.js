// src/screens/Music/MusicService.js

// wav는 import가 아니라 require 사용해야 확실하게 인식됨
const sample_audio = require("../../../assets/audio/sample_audio.wav");

let musicDB = [
  {
    id: 1,
    title: "Ocean Breeze",
    emotion: "calm",
    duration: "2:45",
    icon: "🌊",
    description: "잔잔한 파도 소리와 함께 마음이 안정되는 음악.",
    audio: sample_audio,   // ★ 실제 샘플 오디오 파일
  },
  {
    id: 2,
    title: "Sunny Morning",
    emotion: "joy",
    duration: "3:10",
    icon: "☀️",
    description: "산뜻한 햇살 느낌의 밝은 배경 음악.",
    audio: null,
  },
  {
    id: 3,
    title: "Moonlight",
    emotion: "sadness",
    duration: "2:56",
    icon: "🌙",
    description: "고요한 밤하늘 아래에서 듣기 좋은 차분한 곡.",
    audio: null,
  },
];

export async function getAllMusic() {
  return [...musicDB];
}

export async function getMusicById(id) {
  return musicDB.find((m) => m.id === id) || null;
}

export async function addMusic(newItem) {
  const nextId = musicDB.length + 1;
  const music = { id: nextId, ...newItem };
  musicDB.push(music);
  return music;
}
