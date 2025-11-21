// YYYY-MM-DD → Date(한국 00:00:00)
export function toKST(dateString) {
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(y, m - 1, d); // JS는 월이 0부터 시작
}

// 오늘 YYYY-MM-DD 생성용
export function getTodayYMD() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}
