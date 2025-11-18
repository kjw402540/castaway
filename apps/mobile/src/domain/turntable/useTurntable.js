import { useState, useEffect, useCallback } from "react";
import { getAudioByDate } from "./TurntableService";

export const useTurntable = () => {
  const [date, setDate] = useState(getToday());
  const [audioItems, setAudioItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [noMusic, setNoMusic] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadByDate(date);
  }, [date]);

  const loadByDate = async (selectedDate) => {
    try {
      setIsLoading(true);

      const items = await getAudioByDate(selectedDate);

      if (items.length === 0) {
        setNoMusic(true);
        setAudioItems([]);
        return;
      }

      setNoMusic(false);
      setAudioItems(items);
      setSelectedIndex(0);
    } catch (e) {
      console.error("Turntable load error:", e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const total = audioItems.length;

  const handleNext = useCallback(() => {
    if (total === 0) return;
    setSelectedIndex((i) => (i + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    setSelectedIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const currentItem = audioItems[selectedIndex] || null;

  const getVisibleItems = () => {
    if (audioItems.length <= 3) {
      return audioItems.map((x) => ({
        ...x,
        isSelected: x.id === currentItem?.id,
      }));
    }

    const prev = (selectedIndex - 1 + total) % total;
    const next = (selectedIndex + 1) % total;

    return [
      { ...audioItems[prev], isSelected: false },
      { ...audioItems[selectedIndex], isSelected: true },
      { ...audioItems[next], isSelected: false },
    ];
  };

  return {
    // 날짜 관리
    date,
    setDate,

    // 음악 상태
    audioItems,
    currentItem,
    selectedIndex,
    setSelectedIndex,

    // 상태
    noMusic,
    isLoading,
    error,

    // 동작
    handleNext,
    handlePrev,
    getVisibleItems,
  };
};

function getToday() {
  return new Date().toISOString().split("T")[0];
}
