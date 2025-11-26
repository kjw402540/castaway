// src/mocks/mailMock.js

// 메모리 기반 임시 메일 저장소
let TEMP_MAIL = [
  {
    id: "1001",
    title: "Castaway에 온 걸 환영해요!",
    message: "오늘도 당신의 감정이 섬을 조금 더 풍성하게 만들 거예요.",
    emotion: "Neutral",
    object: null,
    date: "2025-11-20T09:00:00",
    read: false,
  },
  {
    id: "1002",
    title: "첫 번째 오브제가 도착했습니다",
    message: "당신의 감정에 반응한 새로운 오브제가 생성됐어요!",
    emotion: "Joy",
    object: { emoji: "🎁", emotion: "Joy" },
    date: "2025-11-21T14:12:00",
    read: true,
  }
];

export const mailMock = {
  // 전체 가져오기
  getAll() {
    return [...TEMP_MAIL];
  },

  // 새 메일 추가
  add(mail) {
    TEMP_MAIL.unshift({
      id: mail.id || Date.now().toString(),
      title: mail.title,
      message: mail.message,
      emotion: mail.emotion ?? null,
      object: mail.object ?? null,
      date: mail.date || new Date().toISOString(),
      read: false,
    });
    return true;
  },

  // 읽음 처리
  markAsRead(id) {
    const i = TEMP_MAIL.findIndex((m) => m.id === id);
    if (i !== -1) TEMP_MAIL[i].read = true;
    return true;
  },

  // 삭제 (단건 or 배열 or 전체)
  delete(idOrArray) {
    // 전체 삭제
    if (idOrArray === "all") {
      TEMP_MAIL = [];
      return true;
    }

    // 다중 삭제
    if (Array.isArray(idOrArray)) {
      TEMP_MAIL = TEMP_MAIL.filter((m) => !idOrArray.includes(m.id));
      return true;
    }

    // 단건 삭제
    TEMP_MAIL = TEMP_MAIL.filter((m) => m.id !== idOrArray);
    return true;
  },
};
