// src/mocks/emotionMock.js (예상 코드)
export const emotionMock = {
  analyze: async (text) => {
    // 간단한 키워드 기반 분석
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('행복') || lowerText.includes('기쁨') || lowerText.includes('좋아')) {
      return { emotion: 'Joy' };
    }
    if (lowerText.includes('슬프') || lowerText.includes('우울') || lowerText.includes('힘들')) {
      return { emotion: 'Sadness' };
    }
    if (lowerText.includes('화') || lowerText.includes('짜증') || lowerText.includes('싫어')) {
      return { emotion: 'Anger/Disgust' };
    }
    if (lowerText.includes('헉') || lowerText.includes('놀라') || lowerText.includes('두려')) {
      return { emotion: 'Surprise/Fear' };
    }
    
    return { emotion: 'Neutral' };
  }
};