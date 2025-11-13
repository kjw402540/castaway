import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 더미: AI 감정 결과 기반 테마 변경 예정
  const [theme, setTheme] = useState("light");

  const colors = {
    light: {
      primary: "#1E3A8A",
      secondary: "#3B82F6",
      background: "#F0F9FF",
      card: "#FFFFFF",
      text: "#1E293B",
    },
    dark: {
      primary: "#93C5FD",
      secondary: "#60A5FA",
      background: "#0F172A",
      card: "#1E293B",
      text: "#F8FAFC",
    },
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, colors: colors[theme], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
