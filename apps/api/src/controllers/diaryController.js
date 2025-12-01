import * as diaryService from "../services/diaryService.js";
import * as aiService from "../services/aiService.js";

/* ------------------------------------------------------------------
   [Helper] 유저 ID 추출
------------------------------------------------------------------ */
function getUserId(req) {
  if (req.user?.id) return req.user.id;
  if (req.query.userId) return Number(req.query.userId);
  return 1; // 개발용 fallback
}

/* ------------------------------------------------------------------
   GET /api/diary (전체 조회)
------------------------------------------------------------------ */
export const getAll = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const list = await diaryService.getAll(userId);
    res.json(list);
  } catch (err) {
    next(err);
  }
};

/* ------------------------------------------------------------------
   GET /api/diary/:date (날짜별 상세 조회)
------------------------------------------------------------------ */
export const getByDate = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { date } = req.params;
    const diary = await diaryService.getByDate(userId, date);
    res.json(diary);
  } catch (err) {
    next(err);
  }
};

/* ------------------------------------------------------------------
   POST /api/diary (일기 작성 & AI 분석 트리거)
------------------------------------------------------------------ */
export const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // 1. [Node -> DB] 일기 내용 저장 (트랜잭션 처리됨)
    const newDiary = await diaryService.create(userId, req.body);
    
    res.json(newDiary);

    setTimeout(() => {
        // 방금 저장된 일기의 ID(diary_id)와 본문(original_text) 확인
        if (newDiary.diary_id && newDiary.original_text) {
            
            // 🚀 [핵심] AI 서비스의 통합 워크플로우 함수 호출
            // (감정분석 -> EmotionResult 저장 -> BGM 생성 -> Diary 업데이트)
            aiService.runFullAnalysisWorkflow(newDiary.diary_id, newDiary.original_text)
                .catch(err => {
                    // 백그라운드 에러는 서버 콘솔에만 남김 (서버 죽지 않음)
                    console.error("❌ [Background] AI 분석 트리거 실패:", err);
                });

        } else {
            console.error("❌ [Background] 분석 불가: diary_id 또는 text 누락", newDiary);
        }
    }, 0);

  } catch (err) {
    // DB 저장 단계에서 실패하면 에러 응답 보냄
    next(err);
  }
};

/* ------------------------------------------------------------------
   DELETE /api/diary/:date (일기 삭제)
------------------------------------------------------------------ */
export const remove = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { date } = req.params;

    await diaryService.remove(userId, date);

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};