// src/controllers/reportController.js
import * as reportService from "../services/reportService.js";

/* --------------------------------------------------------
   이번 주 리포트 조회 (GET)
-------------------------------------------------------- */
export const getWeekly = async (req, res, next) => {
  try {
    const userId = req.user?.user_id || 6; 
    const report = await reportService.getWeekly(userId);
    res.json(report);
  } catch (err) {
    console.error("🔥 [API] 조회 중 에러:", err);
    next(err);
  }
};

/* --------------------------------------------------------
   전체 히스토리 조회 (GET)
-------------------------------------------------------- */
export const getHistory = async (req, res, next) => {
  try {
    const userId = req.user?.user_id || 6;

    const list = await reportService.getHistory(userId);
    res.json(list);
  } catch (err) {
    next(err);
  }
};

/* --------------------------------------------------------
   단일 리포트 상세 (GET)
-------------------------------------------------------- */
export const getById = async (req, res, next) => {
  try {
    // 단일 조회는 report_id만 있으면 되니까 user_id는 검증용으로만 필요하거나 안 써도 됨
    const report = await reportService.getById(req.params.id);
    res.json(report);
  } catch (err) {
    next(err);
  }
};

/* --------------------------------------------------------
   ★ 리포트 생성 요청 (POST)
   - Body: { "date": "2025-11-24" }
-------------------------------------------------------- */
export const generate = async (req, res, next) => {
  try {
    // 1. 로그인한 유저 ID 가져오기 (없으면 6번)
    const userId = req.user?.user_id || 6;
    
    // 2. 날짜가 없으면 오늘 날짜 기준
    const targetDate = req.body.date || new Date().toISOString();
    
    const newReport = await reportService.generateWeekly(userId, targetDate);
    res.json(newReport);
  } catch (err) {
    next(err);
  }
};