// src/screens/hooks/useHomeFlow.js

import { useState, useRef } from "react";

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

  // 일기 저장 완료 후 호출
  const startAnalysis = async () => {
    setTodayStatus("analyzing");
    setShowAnalysis(true);

    // TODO: 여기서 실제 백엔드 호출 붙이면 됨
    await new Promise((resolve) => setTimeout(resolve, 900));

    setShowAnalysis(false);
    setTodayStatus("object_created");
    setShowReward(true);

    setToastMessage("새 오브제가 생성되었습니다.");
    setToastVisible(true);
  };

  const finishReward = () => {
    setShowReward(false);
    startObjectTutorial();
    // 오늘 하루는 "오브제 있음" 상태 유지하고 싶으면 그대로 두고
    // 감정 분석만 끝난 느낌으로 가고 싶으면 아래 주석 풀면 됨
    // setTodayStatus("done");
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
