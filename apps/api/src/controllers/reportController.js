// src/controllers/reportController.js
import * as reportService from "../services/reportService.js";

/* --------------------------------------------------------
   [Helper] 유저 ID 추출 함수
   1순위: 로그인 토큰 (req.user.user_id)
   2순위: Body 데이터 (req.body.userId) - POST 요청 시
   3순위: Query 파라미터 (req.query.userId) - GET 요청 시 (?userId=1)
   -------------------------------------------------------- */
const getUserId = (req) => {
  const userId = req.user?.user_id || req.body.userId || req.query.userId;
  
  if (!userId) {
    throw new Error("로그인 토큰이 없거나 userId가 지정되지 않았습니다.");
  }
  return Number(userId); // 숫자로 변환
};

/* --------------------------------------------------------
   이번 주 리포트 조회 (GET)
-------------------------------------------------------- */
export const getWeekly = async (req, res, next) => {
  try {
    const userId = getUserId(req); // 6번 하드코딩 제거됨
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
    const userId = getUserId(req); // 6번 하드코딩 제거됨
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
    // 단일 조회는 report_id가 기준이므로 userId 검증 불필요
    const report = await reportService.getById(req.params.id);
    res.json(report);
  } catch (err) {
    next(err);
  }
};

/* --------------------------------------------------------
   ★ 리포트 생성 요청 (POST)
   - Body 예시: { "userId": 10, "date": "2025-11-24" }
-------------------------------------------------------- */
export const generate = async (req, res, next) => {
  try {
    // 1. 유저 ID 가져오기 (토큰 -> Body 순서, 하드코딩 제거)
    const userId = getUserId(req);
    
    // 2. 날짜가 없으면 오늘 날짜 기준
    const targetDate = req.body.date || new Date().toISOString();
    
    const newReport = await reportService.generateWeekly(userId, targetDate);
    res.json(newReport);
  } catch (err) {
    next(err);
  }
};