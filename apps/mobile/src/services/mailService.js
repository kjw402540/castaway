// src/services/mailService.js

// 가짜 데이터 (초기값)
let mockMails = [
  { id: 101, title: "[공지] 서비스 업데이트 안내", content: "더 나은 서비스를 위해...", date: "2025-11-18", read: false },
  { id: 102, title: "가지볶음 님의 새 일기가 도착했습니다", content: "오늘 하루 기록...", date: "2025-11-19", read: false },
  { id: 103, title: "[이벤트] 쿠폰이 지급되었습니다!", content: "지금 바로 확인...", date: "2025-11-20", read: true },
  { id: 104, title: "오브젝트 발견 보상", content: "새로운 오브젝트를 발견했습니다.", date: "2025-11-20", read: false },
];

// 백엔드 연결 스위치는 profileService와 동일하게 작동한다고 가정

// [GET] 메일 목록 불러오기
export async function getMails() {
  // 실제 API 통신 로직은 생략하고 Mock Data만 제공
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockMails), 300);
  });
}

// [DELETE] 전체 메일 삭제
export async function deleteAllMails() {
  // 실제 API 통신 후
  mockMails = []; // Mock 데이터 초기화
  return true; // 성공
}

// [DELETE] 선택 메일 삭제
export async function deleteSelectedMails(mailIds) {
  // mailIds 배열에 포함되지 않은 메일만 남김
  mockMails = mockMails.filter(mail => !mailIds.includes(mail.id));
  return true; // 성공
}