// src/screens/Mail/hooks/useNotification.js
// Notification DB 기반 알림 관리 훅
// 읽음/삭제/전체삭제/편집모드/상세모달 상태 포함

import { useState, useEffect, useCallback } from "react";
import { 
  getAllNotification,
  deleteNotification,
  markNotificationAsRead
} from "../../../services/notificationService";

export function useNotification() {
  const [list, setList] = useState([]);               // 알림 목록(DB)
  const [selectedIds, setSelectedIds] = useState([]); // 선택된 알림 ID들
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [detailItem, setDetailItem] = useState(null); // 상세 알림 객체 저장

  // -------------------------------
  // 알림 전체 로드 (최신순 정렬)
  // -------------------------------
  const loadList = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllNotification();
      
      // 최신 생성순으로 정렬 (created_date DESC)
      const sorted = [...data].sort(
        (a, b) => new Date(b.created_date) - new Date(a.created_date)
      );

      setList(sorted);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  // -------------------------------
  // 개별 선택/해제
  // -------------------------------
  const toggleSelect = useCallback((notify_id) => {
    setSelectedIds((prev) =>
      prev.includes(notify_id)
        ? prev.filter((v) => v !== notify_id)
        : [...prev, notify_id]
    );
  }, []);

  // -------------------------------
  // 전체 선택/해제
  // -------------------------------
  const toggleSelectAll = useCallback(() => {
    if (selectedIds.length === list.length && list.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(list.map((n) => n.notify_id));
    }
  }, [selectedIds, list]);

  // -------------------------------
  // 전체 삭제
  // -------------------------------
  const handleSelectAllDelete = useCallback(async () => {
    await deleteNotification("all"); // 서버에 전체삭제 요청
    
    setList([]); // 프론트에서도 즉시 비우기
    setSelectedIds([]);
    setIsEditMode(false);
  }, []);

  // -------------------------------
  // 선택 삭제
  // -------------------------------
  const handleDeleteSelected = useCallback(async () => {
    if (selectedIds.length === 0) return;

    await deleteNotification(selectedIds);

    setList((prev) =>
      prev.filter((n) => !selectedIds.includes(n.notify_id))
    );

    setSelectedIds([]);
    setIsEditMode(false);
  }, [selectedIds]);

  // -------------------------------
  // 읽음 처리 (서버 + 프론트 동기화)
  // -------------------------------
  const handleMarkAsRead = useCallback(async (notify_id) => {

    await markNotificationAsRead(notify_id);

    setList((prev) =>
      prev.map((n) =>
        n.notify_id === notify_id ? { ...n, is_read: true } : n
      )
    );

    if (detailItem?.notify_id === notify_id) {
      setDetailItem((prev) =>
        prev ? { ...prev, is_read: true } : null
      );
    }
  }, [detailItem]);

  // -------------------------------
  // 네비게이션 뱃지용 unread count
  // -------------------------------
  const unreadCount = list.filter((n) => !n.is_read).length;

  return {
    list,
    unreadCount,

    selectedIds,
    isEditMode,
    isLoading,

    detailItem,
    setDetailItem,

    toggleSelect,
    toggleSelectAll,

    setIsEditMode,
    handleSelectAllDelete,
    handleDeleteSelected,
    handleMarkAsRead,
    reload: loadList, // 외부에서 새로고침 도움줄 수 있음
  };
}
