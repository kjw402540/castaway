// src/screens/hooks/useHomeFlow.js

import { useState, useRef, useEffect } from "react";
import { getDiaryByDate } from "../../../services/diaryService";
import { getTodayPrediction } from "../../../services/emotionService";

// today 문자열 만드는 공용 함수
function getTodayYMD() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function useHomeFlow() {
  // 오늘 상태 (초기값 null = 로딩 중)
  const [todayStatus, setTodayStatus] = useState(null); 
  
  // ✅ [추가] 오늘 쓴 일기 데이터 (감정분석 결과 포함)
  const [todayDiary, setTodayDiary] = useState(null);

  const [todayPrediction, setTodayPrediction] = useState(null);

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
    try {
      const today = getTodayYMD();
      const [diary, prediction] = await Promise.all([
        getDiaryByDate(today),    // 일기 조회
        getTodayPrediction()      // 예측 조회 (서비스 사용)
      ]);

    setTodayPrediction(prediction);

      if (diary) {
        // 오늘 일기가 이미 존재하면
        setTodayStatus("done");
        setTodayDiary(diary); // ✅ 일기 데이터 저장
      } else {
        setTodayStatus("no_diary");
        setTodayDiary(null);
      }
    } catch (err) {
      console.error("일기 확인 실패:", err);
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

    // 실제로는 서버에서 분석이 돌고 있으니 잠시 대기 연출
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setShowAnalysis(false);
    setTodayStatus("object_created");
    setShowReward(true);

    setToastMessage("새 오브제가 생성되었습니다.");
    setToastVisible(true);
    
    // ✅ [핵심] 분석이 끝났으니 DB에서 최신 데이터(감정결과 포함)를 다시 긁어옵니다.
    await initTodayStatus();
  };

  // ================================
  // 4. 보상(오브제) 모달 닫기
  // ================================
  const finishReward = () => {
    setShowReward(false);
    startObjectTutorial();
    // 상태 확정
    setTodayStatus("done");
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  return {
    todayStatus,
    todayDiary, // ✅ 내보내기
    todayPrediction,

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