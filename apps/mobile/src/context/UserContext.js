import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: "소랑",       // 더미 이름
    profileColor: "#93C5FD", // 감정 상태에 따라 바뀔 수도 있음
    emotionLog: [],     // 감정 입력 기록
  });

  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const addEmotionLog = (emotion) => {
    setUser((prev) => ({
      ...prev,
      emotionLog: [...prev.emotionLog, { emotion, date: new Date().toISOString() }],
    }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser, addEmotionLog }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
