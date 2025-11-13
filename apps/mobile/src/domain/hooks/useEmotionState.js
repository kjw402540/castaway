import { useState } from 'react';
import { useEmotion } from '../context/EmotionContext';

export default function useEmotionState() {
  const [loading, setLoading] = useState(false);
  const { setEmotion } = useEmotion();

  const analyzeEmotion = async (text) => {
    setLoading(true);
    try {
      // 간단한 감정 분석 로직 (임시)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 텍스트 기반 간단 감정 분석
      if (text.includes('좋아') || text.includes('행복')) {
        setEmotion('happy');
      } else if (text.includes('슬퍼') || text.includes('우울')) {
        setEmotion('sad');
      } else if (text.includes('화나') || text.includes('짜증')) {
        setEmotion('angry');
      } else {
        setEmotion('neutral');
      }
    } catch (error) {
      console.error('감정 분석 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return { analyzeEmotion, loading };
}