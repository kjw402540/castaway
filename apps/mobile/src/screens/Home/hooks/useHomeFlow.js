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
  // ================================
  // 1. 오늘 상태 (핵심 수정 부분)
  // ================================
  // 초기값을 "no_diary"가 아니라 null로 설정합니다.
  // null: 아직 확인 안 됨 (로딩 중) -> UI 렌더링 안 함
  // "no_diary": 확인해봤는데 진짜 없음 -> 입력창 띄움
  // "done": 이미 있음 -> 입력창 안 띄움
  const [todayStatus, setTodayStatus] = useState(null); 

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
  // 2. 초기 진입 시, 이미 오늘 일기가 있는지 체크
  // ================================
  useEffect(() => {
    initTodayStatus();
  }, []);

  const initTodayStatus = async () => {
    try {
      const today = getTodayYMD();
      const diary = await getDiaryByDate(today);

      if (diary) {
        setTodayStatus("done");
      } else {
        setTodayStatus("no_diary");
      }
    } catch (err) {
      console.error("일기 상태 확인 실패:", err);
      // 에러 시 안전하게 입력창을 띄워줄지, 아니면 에러 처리를 할지 결정
      // 일단은 작성을 유도하기 위해 no_diary로 둠
      setTodayStatus("no_diary");
    }
  };

  // ================================
  // 3. 섬 튜토리얼
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
  // 4. 일기 저장 후 감정 분석 시작
  // ================================
  const startAnalysis = async () => {
    setTodayStatus("analyzing");
    setShowAnalysis(true);

    // 실제 감정 분석 API 붙이는 자리
    // (지금은 시뮬레이션 0.9초 대기)
    await new Promise((resolve) => setTimeout(resolve, 900));

    setShowAnalysis(false);
    setTodayStatus("object_created");
    setShowReward(true);

    setToastMessage("새 오브제가 생성되었습니다.");
    setToastVisible(true);
  };

  // ================================
  // 5. 보상(오브제) 모달 닫기
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
    todayStatus, // null | "no_diary" | "done" ...
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