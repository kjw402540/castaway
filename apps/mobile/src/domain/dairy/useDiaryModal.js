import { useState } from "react";
import { useDiary } from "../../context/DiaryContext";

export function useDiaryModal() {
  const { getDiary } = useDiary();

  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [isDiaryViewVisible, setDiaryViewVisible] = useState(false);
  const [isDiaryModalVisible, setDiaryModalVisible] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDiary, setSelectedDiary] = useState("");
  const [selectedObject, setSelectedObject] = useState("");
  const [editMode, setEditMode] = useState(false);

  const handleSelectDate = async (day) => {
    const date = day.dateString;
    const data = await getDiary(date);

    setSelectedDate(date);

    if (data) {
      setSelectedDiary(data.text);
      setSelectedObject(data.object || null);
      setDiaryViewVisible(true);
      setEditMode(false);
    } else {
      setDiaryModalVisible(true);
      setEditMode(false);
    }
  };

  const openEditModal = async (date) => {
    const data = await getDiary(date);

    setSelectedDate(date);
    setSelectedDiary(data?.text || "");
    setSelectedObject(data?.object || null);
    setDiaryViewVisible(false);
    setDiaryModalVisible(true);
    setEditMode(true);
  };

  return {
    // visibility
    isCalendarVisible,
    setCalendarVisible,
    isDiaryViewVisible,
    setDiaryViewVisible,
    isDiaryModalVisible,
    setDiaryModalVisible,

    // 선택 데이터
    selectedDate,
    selectedDiary,
    selectedObject,
    editMode,

    // 이벤트
    handleSelectDate,
    openEditModal,
  };
}
