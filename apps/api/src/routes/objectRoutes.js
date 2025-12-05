// src/routes/objectRoutes.js
import express from "express";
import * as objectController from "../controllers/objectController.js";
import path from "path";
// ▼ 이미 있는 미들웨어 import
import { authRequired } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

// main.py의 SFTP_REMOTE_OBJECT_DIR 와 정확히 일치해야 합니다.
const OBJECT_STORAGE_ROOT = "/home/ubuntu/apps/castaway_ai/generated_objects";

/* ============================================================
   🔓 [Public] 인증 불필요 경로
   - <Image /> 태그는 헤더에 토큰을 못 넣으므로 인증 없이 접근 허용
   ============================================================ */
router.get("/image", (req, res) => {
  const filename = req.query.filename;

  if (!filename) {
    return res.status(400).json({ error: "파일 이름(filename)이 필요합니다." });
  }

  const filePath = path.join(OBJECT_STORAGE_ROOT, filename);
  const resolvedPath = path.resolve(filePath);
  
  // 보안 검증
  if (!resolvedPath.startsWith(path.resolve(OBJECT_STORAGE_ROOT))) {
    console.error(`[Security Alert] Invalid path requested: ${filePath}`);
    return res.status(403).json({ error: "접근이 금지된 경로입니다." });
  }

  res.sendFile(resolvedPath, (err) => {
    if (err) {
      if (res.headersSent) return;
      console.error(`❌ 오브제 이미지 전송 실패: ${resolvedPath}`, err);
      res.status(404).json({ error: "오브제 이미지를 찾을 수 없습니다." });
    }
  });
});


/* ============================================================
   🔒 [Private] 인증 필요 경로
   - 이 아래쪽 라우트들은 전부 JWT 토큰이 있어야 함 (authRequired 적용)
   ============================================================ */
router.use(authRequired); // 👈 여기서부터 인증 미들웨어 적용!

/* 전체 오브제 (GET /api/object) */
router.get("/", objectController.getAll);

/* 날짜별 조회 (GET /api/object/date/:date) */
router.get("/date/:date", objectController.getByDate);

/* 단일 조회 (GET /api/object/item/:id) */
router.get("/item/:id", objectController.getById);

/* 삭제 (DELETE /api/object/item/:id) */
router.delete("/item/:id", objectController.remove);

/* 배치 (POST /api/object/place/:id) */
router.post("/place/:id", objectController.place);

export default router;