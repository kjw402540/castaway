import * as userService from "../services/userService.js";

/* ----------------------------------------
   내 정보 조회
----------------------------------------- */
export const get = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const user = await userService.get(userId);

    if (!user) {
      return res.status(404).json({ message: "존재하지 않는 사용자입니다." });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------
   프로필 수정
----------------------------------------- */
export const update = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const updated = await userService.update(userId, req.body);

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/* ----------------------------------------
   회원 탈퇴 (soft delete)
----------------------------------------- */
export const remove = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const removed = await userService.remove(userId); 
    
    res.json({ ok: true, removed });
  } catch (err) {
    next(err);
  }
};