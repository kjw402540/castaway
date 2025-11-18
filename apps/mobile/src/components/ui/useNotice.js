// src/hooks/useNotice.js

import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { noticeService } from "./NoticeService"; // 경로 수정 필요

/**
 * 알림 데이터 페칭 및 관련 상태를 관리하는 커스텀 훅
 */
export default function useNotice(visible, onClose) {
  const navigation = useNavigation();
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 모달이 visible 상태가 될 때만 데이터를 새로 페칭
  useEffect(() => {
    if (visible && notices.length === 0) {
      const loadNotices = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await noticeService.fetchNotices();
          setNotices(data);
        } catch (err) {
          setError("알림 데이터를 불러오는 데 실패했습니다.");
          console.error("Fetch Notices Error:", err);
        } finally {
          setIsLoading(false);
        }
      };

      loadNotices();
    }
  }, [visible]);

  // '확인' 버튼 클릭 핸들러 (리포트 알림에 대한 특별 처리)
  const handleCheck = (notice) => {
    onClose(); // 모달 닫기
    
    // 알림 타입에 따라 다른 액션 수행
    if (notice.type === "report") {
      // 100ms 딜레이 후 네비게이션 (onClose 애니메이션과 충돌 방지)
      setTimeout(() => navigation.navigate("Report"), 100); 
    }
    
    // TODO: 백엔드에 해당 알림을 '읽음' 상태로 업데이트하는 로직 추가
    // noticeService.markAsRead(notice.id);
  };

  return {
    notices,
    isLoading,
    error,
    handleCheck,
  };
}