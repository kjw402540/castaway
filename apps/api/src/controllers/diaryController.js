// src/controllers/diaryController.js
import * as diaryService from "../services/diaryService.js";
import * as aiService from "../services/aiService.js"; // AI 요청 담당

function getUserId(req) {
   // 1) JWT가 붙어 있으면 그걸 최우선
  if (req.user?.id) return req.user.id;

  // 2) 디버깅용 / 툴에서 때려볼 때 쿼리로 userId 넘기고 싶으면
  if (req.query.userId) return Number(req.query.userId);

  // 3) 진짜 아무것도 없으면 개발용으로 1번 유저
  return 1;
}

// function getUserId(req) {
//   if (!req.user?.id) {
//     throw new Error("인증되지 않은 요청입니다.");
//   }
//   return req.user.id;
// }

// GET /api/diary
export const getAll = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const list = await diaryService.getAll(userId);
    res.json(list);
  } catch (err) {
    next(err);
  }
};

// GET /api/diary/:date
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

// POST /api/diary
export const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // 1. [DB 저장]
    const newDiary = await diaryService.create(userId, req.body);
    
    // 2. [응답 전송]
    res.json(newDiary);

    // 3. [AI 분석]
    setTimeout(() => {
        if (aiService.analyzeAndSaveEmotion) {
              aiService.analyzeAndSaveEmotion(newDiary.diary_id, newDiary.original_text)
                .catch(e => console.error("AI Background Error:", e));
        }
    }, 0);

  } catch (err) {
    next(err);
  }
};

// DELETE /api/diary/:date
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
