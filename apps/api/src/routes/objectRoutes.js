// src/routes/objectRoutes.js
import express from "express";
import * as objectController from "../controllers/objectController.js";
import path from "path"; 

const router = express.Router();

// main.py의 SFTP_REMOTE_OBJECT_DIR 와 정확히 일치해야 합니다.
const OBJECT_STORAGE_ROOT = "/home/ubuntu/apps/castaway_ai/generated_objects";

/* ----------------------------------------
   오브제 이미지 파일 제공 (앱 내 이미지 로딩용)
   GET /api/object/image?filename=object_xxxx.png
----------------------------------------- */
router.get("/image", (req, res) => {
  const filename = req.query.filename;

  if (!filename) {
    return res.status(400).json({ error: "파일 이름(filename)이 필요합니다." });
  }

  // 1. 파일 경로 생성
  const filePath = path.join(OBJECT_STORAGE_ROOT, filename);

  // 2. 보안 검증 (상위 폴더 접근 차단)
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(path.resolve(OBJECT_STORAGE_ROOT))) {
    console.error(`[Security Alert] Invalid path requested: ${filePath}`);
    return res.status(403).json({ error: "접근이 금지된 경로입니다." });
  }

  // 3. 파일 전송 (sendFile)
  res.sendFile(resolvedPath, (err) => {
    if (err) {
      // 전송 중 끊김 방지
      if (res.headersSent) {
        return; 
      }
      console.error(`❌ 오브제 이미지 전송 실패: ${resolvedPath}`, err);
      res.status(404).json({ error: "오브제 이미지를 찾을 수 없습니다." });
    } else {
      // 성공 로그 (너무 자주 찍히면 주석 처리 가능)
      // console.log(`✅ 오브제 전송 성공: ${filename}`);
    }
  });
});

/* ----------------------------------------
   기존 컨트롤러 라우트들
----------------------------------------- */

/* 단일 조회 */
router.get("/item/:id", objectController.getById);

/* 전체 오브제 */
router.get("/", objectController.getAll);

/* 배치 (미구현 -> 추후 구현 예정) */
router.post("/place/:id", objectController.place);

/* 삭제 (세트 삭제) */
router.delete("/item/:id", objectController.remove);

/* 날짜별 조회 */
router.get("/date/:date", objectController.getByDate);

export default router;