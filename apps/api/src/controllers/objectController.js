// apps/api/src/controllers/objectController.js
import * as objectService from "../services/objectService.js";
import * as diaryService from "../services/diaryService.js";

/* ----------------------------------------
   전체 오브제 조회
----------------------------------------- */
export const getAll = async (req, res, next) => {
  try {
    // 🔐 [인증 필수] 토큰에서 user_id 추출
    const userId = req.user.user_id;
    
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
    // 🔐 [인증 필수]
    const userId = req.user.user_id;
    
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
    
    // (선택사항) 본인 오브제인지 확인하는 로직을 추가할 수도 있음
    // if (item.user_id !== req.user.user_id) return res.status(403)...

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
    const userId = req.user.user_id; // 삭제 요청자 ID

    const obj = await objectService.getById(id);
    if (!obj) return res.status(404).json({ error: "Not found" });

    // 🔐 내 오브제가 맞는지 확인
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