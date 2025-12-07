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
    const userId = req.user.user_id;

    // 1. DB 조회 (이미지 파일명 등은 가져와야 하므로 유지)
    const latestShare = await prisma.sharedObject.findFirst({
      where: { receiver_user_id: userId },
      orderBy: { created_date: "desc" },
      include: {
        Object: true, // 이미지 파일명 필요
        // EmotionResult: true // 키워드 안 쓸 거면 include 안 해도 됨 (해도 상관없음)
      },
    });

    if (!latestShare) {
      return res.status(200).json({ success: true, data: null });
    }

    // 2. [수정] 키워드 강제 고정
    // 원래 로직: const keywords = [ ... ].filter(k => k);
    
    // ✅ 여기를 수정했습니다!
    const keywords = ["주말", "성취"]; 

    // 3. 응답 데이터 구성
    const resultData = {
      share_id: latestShare.share_id,
      object_name: latestShare.Object.object_name,
      object_image_filename: latestShare.Object.object_image,
      keywords: keywords, // 무조건 ["주말", "성취"]가 나갑니다.
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