// src/routes/bgmRoutes.js
import express from "express";
import * as bgmController from "../controllers/bgmController.js";
import path from "path"; // 👈 경로 처리를 위해 추가

const router = express.Router();

// ⚠️ EC2 1에 BGM 파일이 저장되는 최종 경로 (FastAPI가 SFTP로 보내는 경로)
// 이 경로는 실제 서버의 디렉토리 구조와 일치해야 합니다.
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

  // 2. 보안 검증 (상위 디렉토리 접근 공격 방지)
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(path.resolve(BGM_STORAGE_ROOT))) {
    console.error(`[Security Alert] Invalid path requested: ${filePath}`);
    return res.status(403).json({ error: "접근이 금지된 경로입니다." });
  }

  // 3. 파일 전송
  res.sendFile(resolvedPath, (err) => {
    if (err) {
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