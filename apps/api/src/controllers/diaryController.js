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
   POST /api/diary (일기 작성 + AI 분석 즉시 반영)
------------------------------------------------------------------ */
export const create = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // (1) 일기 DB 저장
    const newDiary = await diaryService.create(userId, req.body);

    if (!newDiary.diary_id || !newDiary.original_text) {
      throw new Error("❌ 분석 불가: diary_id 또는 text 누락");
    }

    // (2) 감정 분석 + DB 연동까지 끝날 때까지 기다림
    const emotionLabel = await aiService.runFullAnalysisWorkflow(
      newDiary.diary_id,
      newDiary.original_text
    );

    // (3) 분석 결과가 반영된 최신 Diary 재조회
    const finalDiary = await diaryService.getByDate(
      userId,
      req.body.date
    );

    // 👉 감정 레이블 포함하여 즉시 응답!
    res.json({
      ...finalDiary,
      emotion_label: emotionLabel,
    });

  } catch (err) {
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
