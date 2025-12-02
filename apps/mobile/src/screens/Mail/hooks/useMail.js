// src/screens/Mail/hooks/useMail.js

import { useState, useEffect, useCallback } from "react";
import {
  fetchMailList,
  fetchMailDetail,
  markMailAsRead,
  deleteMail,
  subscribeNotificationUpdate,
} from "../../../services/notificationService";

export function useMail() {
  const [mails, setMails] = useState([]);
  const [selectedMailIds, setSelectedMailIds] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [detailMail, setDetailMail] = useState(null);

  // 메일 목록 로딩
  const loadMails = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchMailList();
      setMails(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 첫 로딩 + Notification 업데이트 시 다시 로딩
  useEffect(() => {
    loadMails();

    const unsubscribe = subscribeNotificationUpdate(loadMails);
    return () => unsubscribe();
  }, [loadMails]);

  // 선택 토글
  const toggleSelect = (id) => {
    setSelectedMailIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  // 선택 삭제
  const handleDeleteSelected = async () => {
    for (const id of selectedMailIds) {
      await deleteMail(id);
    }
    setSelectedMailIds([]);
    setIsEditMode(false);
    loadMails();
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedMailIds.length === mails.length) {
      setSelectedMailIds([]);
    } else {
      setSelectedMailIds(mails.map((m) => m.id));
    }
  };

  // 전체 삭제
  const handleSelectAllDelete = async () => {
    for (const m of mails) {
      await deleteMail(m.id);
    }
    setSelectedMailIds([]);
    setIsEditMode(false);
    loadMails();
  };

  // 읽음 처리
  const handleMarkAsRead = async (id) => {
    await markMailAsRead(id);
    setMails((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
  };

  return {
    mails,
    selectedMailIds,
    isEditMode,
    isLoading,
    detailMail,
    unreadCount: mails.filter((m) => !m.read).length,

    setDetailMail,
    setIsEditMode,

    toggleSelect,
    toggleSelectAll,
    handleDeleteSelected,
    handleSelectAllDelete,
    handleMarkAsRead,
  };
}
