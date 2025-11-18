// src/domain/diary/useDiary.js

import { useState } from "react";
import { getDiary, saveDiary } from "./DiaryService";

export function useDiary() {
  // 모달 상태
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [isDiaryViewVisible, setDiaryViewVisible] = useState(false);
  const [isDiaryWriteVisible, setDiaryWriteVisible] = useState(false);

  // 선택된 일기 데이터
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDiary, setSelectedDiary] = useState("");
  const [selectedObject, setSelectedObject] = useState(null);

  // 수정 여부
  const [editMode, setEditMode] = useState(false);

  // 오늘 바로 일기 작성
  const openTodayWrite = () => {
    const today = new Date().toISOString().split("T")[0];

    setSelectedDate(today);
    setSelectedDiary("");
    setSelectedObject(null);
    setEditMode(false);

    setDiaryWriteVisible(true);
  };

  // 캘린더 날짜 선택 → 조회 or 작성
  const handleSelectDate = async (day) => {
    const date = day.dateString;
    setSelectedDate(date);

    const data = await getDiary(date);

    if (data) {
      setSelectedDiary(data.text);
      setSelectedObject(data.object || null);
      setEditMode(false);

      requestAnimationFrame(() => setDiaryViewVisible(true));
    } else {
      setSelectedDiary("");
      setSelectedObject(null);
      setEditMode(false);

      requestAnimationFrame(() => setDiaryWriteVisible(true));
    }
  };

  const handleSelectDateFromTurntable = async (day) => {
    const date = day.dateString;
    setSelectedDate(date);

    const data = await getDiary(date);

    // 해당 날짜에 음악 없으면
    if (!data || !data.object || !data.object.audio) {
      // turntable에 날짜 전파해서 "음악 없음 UI" 띄움
      setTurntableDate(date);
      setCalendarVisible(false);
      return;
    }

    // 음악 있는 경우 → turntable이 track 재선택
    setTurntableDate(date);
    setCalendarVisible(false);
  };


  // Chest에서 오브제 클릭 → 바로 조회
  const openFromChest = async (date) => {
    const data = await getDiary(date);

    if (data) {
      setSelectedDate(date);
      setSelectedDiary(data.text);
      setSelectedObject(data.object || null);
      setEditMode(false);

      requestAnimationFrame(() => setDiaryViewVisible(true));
    }
  };

  // 조회 → 수정 모달
  const openEditModal = async (date) => {
    const data = await getDiary(date);

    setSelectedDate(date);
    setSelectedDiary(data?.text || "");
    setSelectedObject(data?.object || null);

    setDiaryViewVisible(false);

    requestAnimationFrame(() => setDiaryWriteVisible(true));

    setEditMode(true);
  };

  // 저장 후 다시 조회
  const handleSaved = async (date, text, object) => {
    await saveDiary(date, text, object);

    setSelectedDiary(text);
    setSelectedObject(object || null);

    setDiaryWriteVisible(false);
    requestAnimationFrame(() => setDiaryViewVisible(true));
  };

  return {
    // 모달
    isCalendarVisible,
    setCalendarVisible,

    isDiaryViewVisible,
    setDiaryViewVisible,

    isDiaryWriteVisible,
    setDiaryWriteVisible,
    
    handleSelectDateFromTurntable,

    // 선택값
    selectedDate,
    selectedDiary,
    selectedObject,
    editMode,

    // 액션
    openTodayWrite,
    openEditModal,
    handleSelectDate,
    handleSaved,
    openFromChest,

    // DiaryService 직접 제공 (Chest에서 필요)
    getDiary,
  };
}
