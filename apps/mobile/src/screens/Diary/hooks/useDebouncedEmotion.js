// src/screens/Diary/hooks/useDebouncedEmotion.js
import { useEffect, useRef } from "react";
import { analyzeEmotion } from "../../../services/emotionService";

export function useDebouncedEmotion({
  text,
  visible,
  setEmotion,
  delay = 500,
}) {
  const aliveRef = useRef(false);

  useEffect(() => {
    // visible 변경될 때마다 현재 모달 상태 기록
    aliveRef.current = visible;

    // 닫혔으면 아무것도 안 함
    if (!visible) return;

    const timer = setTimeout(async () => {
      // 타이머가 돌고 있는 동안 닫혔으면 중단
      if (!aliveRef.current) return;

      if (text.trim()) {
        const emotion = await analyzeEmotion(text);

        // await 사이에 닫혔을 수도 있으니 또 체크
        if (!aliveRef.current) return;

        setEmotion(emotion);
      } else {
        setEmotion("Neutral");
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, visible, setEmotion, delay]);
}
