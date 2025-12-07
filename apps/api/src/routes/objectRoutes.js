// src/routes/objectRoutes.js
import express from "express";
import * as objectController from "../controllers/objectController.js";
import path from "path";
import { authRequired } from "../middlewares/authMiddleware.js";

// ✅ [1. 추가] DB 조회를 위해 prisma 임포트가 필요합니다.
import prisma from "../lib/prisma.js"; 

const router = express.Router();

const OBJECT_STORAGE_ROOT = "/home/ubuntu/apps/castaway_ai/generated_objects";

/* ============================================================
   🔓 [Public] 인증 불필요 경로
   ============================================================ */
router.get("/image", (req, res) => {
  // ... (기존 이미지 서빙 코드 유지) ...
  const filename = req.query.filename;
  if (!filename) {
    return res.status(400).json({ error: "파일 이름(filename)이 필요합니다." });
  }
  const filePath = path.join(OBJECT_STORAGE_ROOT, filename);
  const resolvedPath = path.resolve(filePath);
  
  if (!resolvedPath.startsWith(path.resolve(OBJECT_STORAGE_ROOT))) {
    return res.status(403).json({ error: "접근이 금지된 경로입니다." });
  }

  res.sendFile(resolvedPath, (err) => {
    if (err && !res.headersSent) {
      res.status(404).json({ error: "오브제 이미지를 찾을 수 없습니다." });
    }
  });
});


/* ============================================================
   🔒 [Private] 인증 필요 경로
   ============================================================ */
router.use(authRequired); // 👈 여기서부터 인증 적용됨

// ✅ [2. 추가] 가장 최근 공유받은 오브제 조회 (컨트롤러 없이 여기서 바로 처리)
// (주의: 다른 '/:id' 같은 라우트보다 위에 있어야 안전합니다)
router.get("/shared/latest", async (req, res) => {
  try {
    const userId = req.user.user_id; // authRequired 미들웨어가 토큰 해석해서 넣어줌

    // 1. SharedObject 테이블 조회 (내가 받은 것 중 최신 1개)
    const latestShare = await prisma.sharedObject.findFirst({
      where: { receiver_user_id: userId },
      orderBy: { created_date: "desc" },
      include: {
        Object: true,       // 이미지 파일명
        EmotionResult: true // 키워드
      },
    });

    // 2. 받은 게 없으면 null 리턴
    if (!latestShare) {
      return res.status(200).json({ success: true, data: null });
    }

    // 3. 키워드 정리 (null 제외)
    const em = latestShare.EmotionResult;
    const keywords = [em?.keyword_1, em?.keyword_2, em?.keyword_3].filter(k => k);

    // 4. 응답 데이터 구성
    const resultData = {
      share_id: latestShare.share_id,
      object_name: latestShare.Object.object_name,
      object_image_filename: latestShare.Object.object_image,
      keywords: keywords,
      received_date: latestShare.created_date,
      message: latestShare.note
    };

    return res.status(200).json({ success: true, data: resultData });

  } catch (error) {
    console.error("❌ 공유 오브제 조회 실패:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

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