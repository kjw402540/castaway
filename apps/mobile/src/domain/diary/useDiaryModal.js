import { useState } from "react";
import { useDiary } from "../../context/DiaryContext";

export function useDiaryModal() {
  const { getDiary, saveDiary } = useDiary();

  // 캘린더
  const [isCalendarVisible, setCalendarVisible] = useState(false);

  // 조회 모달
  const [isDiaryViewVisible, setDiaryViewVisible] = useState(false);

  // 작성/수정 모달
  const [isDiaryWriteVisible, setDiaryWriteVisible] = useState(false);

  // 선택된 값들
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDiary, setSelectedDiary] = useState("");
  const [selectedObject, setSelectedObject] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const openTodayWrite = () => {
    const today = new Date().toISOString().split("T")[0];

    setSelectedDate(today);
    setSelectedDiary("");
    setSelectedObject(null);

    setEditMode(false);
    setDiaryWriteVisible(true);
  };


  // 날짜 선택
  const handleSelectDate = async (day) => {
    const date = day.dateString;
    setSelectedDate(date);

    const data = await getDiary(date);

    // setCalendarVisible(false);

    if (data) {
      // 조회
      setSelectedDiary(data.text);
      setSelectedObject(data.object || null);

      requestAnimationFrame(() => {
        setDiaryViewVisible(true);
      });

      setEditMode(false);
    } else {
      // 작성
      setSelectedDiary("");
      setSelectedObject(null);

      requestAnimationFrame(() => {
        setDiaryWriteVisible(true);
      });

      setEditMode(false);
    }
  };

  // 수정
  const openEditModal = async (date) => {
    const data = await getDiary(date);

    setSelectedDate(date);
    setSelectedDiary(data?.text || "");
    setSelectedObject(data?.object || null);
    setDiaryViewVisible(false);

    requestAnimationFrame(() => {
      setDiaryWriteVisible(true);
    });

    setEditMode(true);
  };

  // 저장 후
  const handleSaved = async (date, text, object) => {
    await saveDiary(date, text, object);

    setSelectedDiary(text);
    setSelectedObject(object || null);

    setDiaryWriteVisible(false);

    requestAnimationFrame(() => {
      setDiaryViewVisible(true);
    });
  };

  return {
    // 캘린더
    isCalendarVisible,
    setCalendarVisible,

    // 조회
    isDiaryViewVisible,
    setDiaryViewVisible,

    // 작성/수정
    isDiaryWriteVisible,
    setDiaryWriteVisible,

    // data
    selectedDate,
    selectedDiary,
    selectedObject,
    editMode,

    // handlers
    handleSelectDate,
    openEditModal,
    handleSaved,

    openTodayWrite,

  };
}
