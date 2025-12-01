// src/context/ThemeContext.js
import React, { createContext, useContext, useState } from "react";
import { emotionColors } from "../utils/emotionMap";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [emotion, setEmotion] = useState("Neutral"); // 감정 상태 저장

  // 감정에 따른 테마 자동 매핑
  const theme = emotionColors[emotion] || emotionColors.Neutral;

  return (
    <ThemeContext.Provider value={{ theme, emotion, setEmotion }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
