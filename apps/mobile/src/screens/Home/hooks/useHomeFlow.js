// src/screens/hooks/useHomeFlow.js

import { useState, useRef, useEffect } from "react";
import { getDiaryByDate } from "../../../services/diaryService";

// today 문자열 만드는 공용 함수
function getTodayYMD() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function useHomeFlow() {
  // 오늘 상태
  const [todayStatus, setTodayStatus] = useState("no_diary");
  // "no_diary" | "analyzing" | "object_created" | "done"

  // 오버레이
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showReward, setShowReward] = useState(false);

  // 토스트
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // 튜토리얼
  const [showTutorialIsland, setShowTutorialIsland] = useState(false);
  const [showTutorialObject, setShowTutorialObject] = useState(false);
  const islandShown = useRef(false);
  const objectShown = useRef(false);

  // ================================
  // 1. 초기 진입 시, 이미 오늘 일기가 있는지 체크
  // ================================
  useEffect(() => {
    initTodayStatus();
  }, []);

  const initTodayStatus = async () => {
    const today = getTodayYMD();
    const diary = await getDiaryByDate(today);

    if (diary) {
      // 오늘 일기가 이미 존재하면
      setTodayStatus("done");
    } else {
      setTodayStatus("no_diary");
    }
  };

  // ================================
  // 2. 섬 튜토리얼
  // ================================
  const startIslandTutorial = () => {
    if (islandShown.current) return;
    islandShown.current = true;
    setShowTutorialIsland(true);
    setTimeout(() => setShowTutorialIsland(false), 2000);
  };

  const startObjectTutorial = () => {
    if (objectShown.current) return;
    objectShown.current = true;
    setShowTutorialObject(true);
    setTimeout(() => setShowTutorialObject(false), 2500);
  };

  // ================================
  // 3. 일기 저장 후 감정 분석 시작
  // ================================
  const startAnalysis = async () => {
    setTodayStatus("analyzing");
    setShowAnalysis(true);

    // 실제 감정 분석 API 붙이는 자리
    await new Promise((resolve) => setTimeout(resolve, 900));

    setShowAnalysis(false);
    setTodayStatus("object_created");
    setShowReward(true);

    setToastMessage("새 오브제가 생성되었습니다.");
    setToastVisible(true);
  };

  // ================================
  // 4. 보상(오브제) 모달 닫기
  // ================================
  const finishReward = () => {
    setShowReward(false);
    startObjectTutorial();

    // 오늘은 일기 있음 상태로 고정
    setTodayStatus("done");
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  return {
    todayStatus,
    showAnalysis,
    showReward,
    toastVisible,
    toastMessage,

    showTutorialIsland,
    showTutorialObject,

    startIslandTutorial,
    startAnalysis,
    finishReward,
    hideToast,
  };
}
