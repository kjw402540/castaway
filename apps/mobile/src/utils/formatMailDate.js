// src/utils/formatMailDate.js
export function formatMailDate(isoString) {
  try {
    const date = new Date(isoString);

    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}
