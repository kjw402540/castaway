// src/context/DiaryContext.js
import React, { createContext, useContext, useState } from "react";
import { fetchDiary, saveDiaryService } from "../domain/diary/DiaryService";

const DiaryContext = createContext();

export function DiaryProvider({ children }) {
  const [cache, setCache] = useState({});

  const getDiary = async (date) => {
    if (cache.hasOwnProperty(date)) {
      return cache[date];
    }

    const data = await fetchDiary(date);

    if (data) {
      setCache((prev) => ({ ...prev, [date]: data }));
    }

    return data;
  };

  const saveDiary = async (date, text, object = null) => {
    const ok = await saveDiaryService(date, text, object);
    if (!ok) return false;

    setCache((prev) => ({
      ...prev,
      [date]: { text, object },
    }));

    return true;
  };

  return (
    <DiaryContext.Provider value={{ getDiary, saveDiary }}>
      {children}
    </DiaryContext.Provider>
  );
}

export function useDiary() {
  return useContext(DiaryContext);
}
