import * as emotionService from "../services/emotionService.js";

/* ------------------------------------------------------------------
   [Helper] 유저 ID 추출 (DiaryController와 동일)
------------------------------------------------------------------ */
function getUserId(req) {
  if (req.user?.id) return req.user.id;
  if (req.query.userId) return Number(req.query.userId);
  
  // 🚨 [테스트용] 배치 돌린 유저 ID가 9번이면 9로 설정, 아니면 1
  return 9; 
}

/* ------------------------------------------------------------------
   POST /api/emotion (텍스트 분석)
------------------------------------------------------------------ */
export const analyze = async (req, res, next) => {
  try {
    const { text } = req.body;
    // 서비스의 analyzeEmotion 호출
    const result = await emotionService.analyzeEmotion(text);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

/* ------------------------------------------------------------------
   GET /api/emotion/today (오늘의 예측 조회)
------------------------------------------------------------------ */
export const getTodayPrediction = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    console.log(`🔎 [Controller] 예측 조회 요청 (User: ${userId})`);

    // 서비스 호출
    const data = await emotionService.getTodayPrediction(userId);

    if (!data) {
        return res.status(200).json({ 
            exists: false, 
            message: "데이터 없음" 
        });
    }
    
    res.json(data);
  } catch (err) {
    next(err);
  }
};