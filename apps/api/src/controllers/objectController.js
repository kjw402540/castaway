// src/controllers/objectController.js
import * as objectService from "../services/objectService.js";
import * as diaryService from "../services/diaryService.js";
import * as bgmService from "../services/bgmService.js";

/* ----------------------------------------
   전체 오브제
----------------------------------------- */
export const getAll = async (req, res, next) => {
  try {
    const userId = 1; // MVP — 나중에 로그인 연결
    const list = await objectService.getAll(userId);
    res.json(list);
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------
   날짜별 오브제  (GET /object/:date)
----------------------------------------- */
export const getByDate = async (req, res, next) => {
  try {
    const userId = 1;
    const { date } = req.params;
    const object = await objectService.getByDate(userId, date);
    res.json(object);
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------
   오브제 상세 조회
----------------------------------------- */
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await objectService.getById(Number(id));
    res.json(item);
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------
   오브제 삭제 (세트 삭제)
----------------------------------------- */
export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    // object 조회 → diary_id 찾기
    const obj = await objectService.getById(Number(id));
    if (!obj) return res.status(404).json({ error: "Not found" });

    const diaryId = obj.diary_id;

    // Diary 삭제 → cascade로 Object/BGM도 자동 삭제
    const removed = await diaryService.remove(diaryId);

    res.json({ ok: true, removed });
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------
   오브제 배치 (위치 저장)
   ※ 현재 DB에 position_x, position_y 없음 → placeholder
----------------------------------------- */
export const place = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 좌표가 아직 없으므로 일단 응답만.
    res.json({
      ok: true,
      object_id: id,
      message: "배치 기능은 추후 확장 예정.",
    });
  } catch (err) {
    next(err);
  }
};
