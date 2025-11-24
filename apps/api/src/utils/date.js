// src/utils/date.js

// YYYY-MM-DD → Date(한국 00:00:00)
export function toKST(dateString) {
  if (!dateString) {
    return new Date();
  }

  // 이미 Date 객체면 그대로 반환
  if (dateString instanceof Date) {
    return dateString;
  }

  // 문자열 정제 (공백, null byte 제거)
  const cleaned = String(dateString).trim().replace(/\0/g, "");

  // YYYY-MM-DD 형식 검증
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(cleaned)) {
    console.warn(`[toKST] Invalid date format: ${cleaned}, using current date`);
    return new Date();
  }

  const [y, m, d] = cleaned.split("-").map(Number);

  // 유효한 날짜인지 확인
  if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31) {
    console.warn(`[toKST] Invalid date values: ${y}-${m}-${d}`);
    return new Date();
  }

  // 로컬 타임존 기준 자정으로 생성
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

// 오늘 YYYY-MM-DD 생성용
export function getTodayYMD() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}