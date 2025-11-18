// src/services/NoticeService.js

/**
 * 알림 데이터를 관리하는 서비스 클래스 (백엔드 연동 예정)
 */
class NoticeService {
  /**
   * Mock 알림 데이터를 가져옵니다.
   * 실제 백엔드 API 호출 로직으로 대체될 예정입니다.
   * @returns {Promise<Array<{id: number, title: string, description: string, isNew: boolean, type: 'report' | 'general'}>>} 알림 목록
   */
  async fetchNotices() {
    // 실제로는 axios 등을 사용하여 API를 호출합니다.
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            title: "주별 리포트가 도착했어요.",
            description: "11월 4주차에는 어떤 감정을 느꼈는지 확인해보세요.",
            isNew: true,
            type: "report", // 리포트 타입 알림
          },
          // 나중에 다른 알림 타입이 추가될 수 있습니다.
          // {
          //   id: 2,
          //   title: "새로운 업데이트 안내",
          //   description: "버그 수정 및 성능 개선이 이루어졌습니다.",
          //   isNew: false,
          //   type: "general",
          // },
        ]);
      }, 500); // 네트워크 지연 모방
    });
  }
}

export const noticeService = new NoticeService();