// src/controllers/diaryController.js
import * as diaryService from "../services/diaryService.js";
import { afterDiarySaved } from "../services/diaryWorkflow.js";

const USER_ID = 1;


/* ---------------------------------------------
   전체 일기 조회
---------------------------------------------- */
export const getAll = async (req, res, next) => {
  try {
    const diaries = await diaryService.getAll(USER_ID);
    res.json(diaries);
  } catch (err) {
    next(err);
  }
};


/* ---------------------------------------------
   특정 날짜 일기 조회 (YYYY-MM-DD)
---------------------------------------------- */
export const getByDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    const diary = await diaryService.getByDate(USER_ID, date);
    res.json(diary);
  } catch (err) {
    next(err);
  }
};


/* ---------------------------------------------
   일기 저장 (작성 + 수정)
   저장 후 Workflow 자동 실행
---------------------------------------------- */
export const save = async (req, res, next) => {
  try {
    const savedDiary = await diaryService.save({
      ...req.body,
      user_id: USER_ID,
    });

    // 비동기 워크플로우 (오브제, BGM, 감정, 알림 생성)
    afterDiarySaved(savedDiary).catch((err) =>
      console.error("[Workflow error]", err)
    );

    res.json(savedDiary);
  } catch (err) {
    next(err);
  }
};


/* ---------------------------------------------
   일기 삭제 (→ 세트 삭제)
---------------------------------------------- */
export const remove = async (req, res, next) => {
  try {
    const { date } = req.params;

    const removed = await diaryService.remove(USER_ID, date);
    res.json(removed);

  } catch (err) {
    next(err);
  }
};
