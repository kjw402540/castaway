// src/screens/Mail/hooks/useMail.js

import { useState, useEffect, useCallback } from "react";
import { 
    getMails, 
    deleteAllMails, 
    deleteSelectedMails,
    markMailAsRead 
} from "../../../services/mailService";

export function useMail() {
  const [mails, setMails] = useState([]);
  const [selectedMailIds, setSelectedMailIds] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 모달 상태 추가
  const [detailMail, setDetailMail] = useState(null); 

  // 메일 목록 불러오기
  const loadMails = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getMails();
      setMails(data);
    } catch (error) {
      console.error("메일 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMails();
  }, [loadMails]);

  // 메일 선택/해제 토글
  const toggleSelect = useCallback((mailId) => {
    setSelectedMailIds(prevIds => {
      if (prevIds.includes(mailId)) {
        return prevIds.filter(id => id !== mailId);
      } else {
        return [...prevIds, mailId];
      }
    });
  }, []);

  // 전체 선택/해제 토글 (추가된 함수)
  const toggleSelectAll = useCallback(() => {
    if (selectedMailIds.length === mails.length && mails.length > 0) {
      // 전체 해제
      setSelectedMailIds([]);
    } else {
      // 전체 선택
      setSelectedMailIds(mails.map(mail => mail.id));
    }
  }, [selectedMailIds.length, mails]);

  // 모두 지우기 실행
  const handleSelectAllDelete = useCallback(async () => {
    if (mails.length === 0) return;
    
    const success = await deleteAllMails();
    if (success) {
      setMails([]);
      setIsEditMode(false); 
      setSelectedMailIds([]);
    }
  }, [mails.length]);

  // 선택 지우기 실행
  const handleDeleteSelected = useCallback(async () => {
    if (selectedMailIds.length === 0) return;

    const success = await deleteSelectedMails(selectedMailIds);
    if (success) {
      setMails(prevMails => prevMails.filter(mail => !selectedMailIds.includes(mail.id)));
      setSelectedMailIds([]);
      setIsEditMode(false); 
    }
  }, [selectedMailIds]);

  // 읽음 처리 핸들러
  const handleMarkAsRead = useCallback(async (mailId) => {
    // 서버에 업데이트 요청
    const success = await markMailAsRead(mailId);

    if (success) {
      // UI 상태 업데이트
      setMails(prevMails => 
        prevMails.map(mail => 
          mail.id === mailId ? { ...mail, read: true } : mail
        )
      );
    }
  }, []);

  return {
    mails,
    selectedMailIds,
    isEditMode,
    isLoading,
    
    detailMail, 
    setDetailMail, 

    toggleSelect,
    toggleSelectAll, // 추가된 함수 export
    setIsEditMode,
    handleSelectAllDelete,
    handleDeleteSelected,
    handleMarkAsRead, 
  };
}