import React, { createContext, useContext, useState } from 'react';

const EmotionContext = createContext();

export function EmotionProvider({ children }) {
  const [emotion, setEmotion] = useState('neutral');

  return (
    <EmotionContext.Provider value={{ emotion, setEmotion }}>
      {children}
    </EmotionContext.Provider>
  );
}

export function useEmotion() {
  const context = useContext(EmotionContext);
  if (!context) {
    throw new Error('useEmotion must be used within EmotionProvider');
  }
  return context;
}