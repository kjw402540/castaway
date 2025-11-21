// src/routes/bgmRoutes.js
import express from "express";
import * as bgmController from "../controllers/bgmController.js";

const router = express.Router();

/* ----------------------------------------
   특정 일기의 BGM 조회
   GET /bgm/diary/:diaryId
----------------------------------------- */
router.get("/diary/:diaryId", bgmController.getByDiary);

/* ----------------------------------------
   전체 BGM (유저 전체)
   GET /bgm
----------------------------------------- */
router.get("/", bgmController.getAll);

/* ----------------------------------------
   BGM 삭제  (→ 세트 삭제)
   DELETE /bgm/:id
----------------------------------------- */
router.delete("/:id", bgmController.remove);

export default router;
