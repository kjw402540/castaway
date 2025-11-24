// src/utils/foramtKoreanDate.js

export function formatKoreanDate(dateString) {
  try {
    const [y, m, d] = dateString.split("-");
    return new Date(+y, +m - 1, +d).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  } catch {
    return dateString;
  }
}
