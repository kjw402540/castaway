// src/controllers/bgmController.js
import * as bgmService from "../services/bgmService.js";
import * as diaryService from "../services/diaryService.js";

/* ----------------------------------------
   특정 일기의 BGM 조회
----------------------------------------- */
export const getByDiary = async (req, res, next) => {
  try {
    const { diaryId } = req.params;
    const bgmList = await bgmService.getByDiary(Number(diaryId));
    res.json(bgmList);
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------
   유저 전체 BGM 조회
----------------------------------------- */
export const getAll = async (req, res, next) => {
  try {
    const userId = 1; // MVP 고정
    const list = await bgmService.getAll(userId);
    res.json(list);
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------
   BGM 삭제  (→ diary 삭제 → object/bgm 모두 사라짐)
----------------------------------------- */
export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const bgm = await bgmService.getById(Number(id));
    if (!bgm) return res.status(404).json({ error: "Not found" });

    const diaryId = bgm.diary_id;

    const removedDiary = await diaryService.remove(diaryId);

    res.json({ ok: true, removed: removedDiary });
  } catch (err) {
    next(err);
  }
};
