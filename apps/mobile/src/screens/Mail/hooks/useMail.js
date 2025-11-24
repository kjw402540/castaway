// src/screens/Mail/hooks/useMail.js
import { useState, useEffect, useCallback } from "react";
import { 
  getAllMail, 
  deleteMail, 
  markAsRead,
  subscribeMailUpdate
} from "../../../services/mailService";

export function useMail() {
  const [mails, setMails] = useState([]);
  const [selectedMailIds, setSelectedMailIds] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [detailMail, setDetailMail] = useState(null);

  // -------------------------------
  // 메일 로드
  // -------------------------------
  const loadMails = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllMail();
      setMails(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMails();
    
    // 메일 업데이트 구독
    const unsubscribe = subscribeMailUpdate(loadMails);
    return () => unsubscribe();
  }, [loadMails]);

  // -------------------------------
  // 선택/해제
  // -------------------------------
  const toggleSelect = useCallback((id) => {
    setSelectedMailIds((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedMailIds.length === mails.length && mails.length > 0) {
      setSelectedMailIds([]);
    } else {
      setSelectedMailIds(mails.map((m) => m.id));
    }
  }, [selectedMailIds, mails]);

  // -------------------------------
  // 전체 삭제
  // -------------------------------
  const handleSelectAllDelete = useCallback(async () => {
    await deleteMail("all");
    setMails([]);
    setSelectedMailIds([]);
    setIsEditMode(false);
  }, []);

  // -------------------------------
  // 선택 삭제
  // -------------------------------
  const handleDeleteSelected = useCallback(async () => {
    if (selectedMailIds.length === 0) return;
    
    await deleteMail(selectedMailIds);
    setMails((prev) => prev.filter((m) => !selectedMailIds.includes(m.id)));
    setSelectedMailIds([]);
    setIsEditMode(false);
  }, [selectedMailIds]);

  // -------------------------------
  // 읽음 처리
  // -------------------------------
  const handleMarkAsRead = useCallback(async (id) => {
    await markAsRead(id);

    setMails((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, read: true } : m
      )
    );
    
    // detailMail도 업데이트
    if (detailMail?.id === id) {
      setDetailMail((prev) => prev ? { ...prev, read: true } : null);
    }
  }, [detailMail]);

  // -------------------------------
  // 네비게이션 빨간 뱃지용 unread count
  // -------------------------------
  const unreadCount = mails.filter((m) => !m.read).length;

  return {
    mails,
    unreadCount,

    selectedMailIds,
    isEditMode,
    isLoading,

    detailMail,
    setDetailMail,

    toggleSelect,
    toggleSelectAll,

    setIsEditMode,
    handleSelectAllDelete,
    handleDeleteSelected,
    handleMarkAsRead,
  };
}