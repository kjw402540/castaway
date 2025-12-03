// src/routes/bgmRoutes.js
import express from "express";
import * as bgmController from "../controllers/bgmController.js";
import path from "path"; 

const router = express.Router();

const BGM_STORAGE_ROOT = "/home/ubuntu/apps/castaway_ai/generated_music";

/* ----------------------------------------
   BGM 파일 다운로드 (스트리밍)
   GET /api/bgm/download?filename=bgm_xxxx.wav
----------------------------------------- */
router.get("/download", (req, res) => {
  const filename = req.query.filename;

  if (!filename) {
    return res.status(400).json({ error: "파일 이름(filename)이 필요합니다." });
  }

  // 1. 파일 경로 생성
  const filePath = path.join(BGM_STORAGE_ROOT, filename);

  // 2. 보안 검증
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(path.resolve(BGM_STORAGE_ROOT))) {
    console.error(`[Security Alert] Invalid path requested: ${filePath}`);
    return res.status(403).json({ error: "접근이 금지된 경로입니다." });
  }

  // 3. 파일 전송 (수정됨)
  res.sendFile(resolvedPath, (err) => {
    if (err) {
      // ✅ [핵심] 이미 헤더가 전송되었다면(전송 중 끊김 등) 추가 응답을 보내지 않음
      if (res.headersSent) {
        console.warn(`⚠️ 전송 중 연결 끊김 (Code: ${err.code}): ${filename}`);
        return; 
      }

      // 전송 시작 전 에러(파일 없음 등)인 경우에만 에러 응답 전송
      console.error(`❌ 파일 전송 실패: ${resolvedPath}`, err);
      res.status(404).json({ error: "BGM 파일을 찾을 수 없습니다." });
    } else {
      console.log(`✅ BGM 전송 성공: ${filename}`);
    }
  });
});

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