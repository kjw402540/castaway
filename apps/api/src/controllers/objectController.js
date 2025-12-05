// src/controllers/objectController.js
import * as objectService from "../services/objectService.js";
import * as diaryService from "../services/diaryService.js";

/* ----------------------------------------
   전체 오브제
----------------------------------------- */
export const getAll = async (req, res, next) => {
  try {
    // ⚠️ 미들웨어(authMiddleware.js)가 'id'로 저장하므로 .id로 접근해야 함!
    const userId = req.user.id; 
    
    const list = await objectService.getAll(userId);
    res.json(list);
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------
   날짜별 오브제
----------------------------------------- */
export const getByDate = async (req, res, next) => {
  try {
    const userId = req.user.id; // 여기도 수정
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
    const item = await objectService.getById(id);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------
   오브제 삭제
----------------------------------------- */
export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // 삭제 권한 확인용 (필요시 사용)

    const obj = await objectService.getById(id);
    if (!obj) return res.status(404).json({ error: "Not found" });

    // (옵션) 본인 것인지 확인
    if (obj.user_id !== userId) {
        return res.status(403).json({ error: "권한이 없습니다." });
    }

    const diaryId = obj.diary_id;
    const removed = await diaryService.removeById(diaryId);

    res.json({ ok: true, removed });
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------
   오브제 배치
----------------------------------------- */
export const place = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.json({
      ok: true,
      object_id: id,
      message: "배치 기능은 추후 확장 예정.",
    });
  } catch (err) {
    next(err);
  }
};