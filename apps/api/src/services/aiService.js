import prisma from "../lib/prisma.js";

/**
 * AI 서버로 분석 요청을 보내고 결과를 DB에 업데이트함
 * (이 파일이 없으면 컨트롤러에서 함수를 못 찾아서 에러가 납니다!)
 */
export const analyzeAndSaveEmotion = async (diaryId, text) => {
  console.log(`🤖 [AI Service] 일기(ID: ${diaryId}) 분석 시작...`);

  try {
    // 1. Python AI 서버 호출 (나중에 실제 주소로 변경)
    // const response = await fetch("http://localhost:8000/analyze", ...);
    
    // 임시: 2초 뒤에 분석 완료된 척 하기
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const mockResult = { emotion: "Happy", score: 0.95 }; 

    console.log(`🤖 [AI Service] 분석 완료! 결과:`, mockResult);

    // 2. DB 업데이트
    await prisma.diary.update({
      where: { 
        diary_id: Number(diaryId) 
      },
      data: {
        // emotion_result 같은 컬럼이 있다면 업데이트
      },
    });

  } catch (error) {
    // 🚨 중요: 여기서 에러가 나도 절대 밖으로 던지지 말고 로그만 찍어야 합니다.
    console.error(`❌ [AI Service] 분석 중 오류 (ID: ${diaryId}):`, error.message);
  }
};