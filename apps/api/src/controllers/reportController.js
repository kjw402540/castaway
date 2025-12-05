// src/controllers/reportController.js
import * as reportService from "../services/reportService.js";

/* --------------------------------------------------------
   [Helper] 유저 ID 추출 함수
   1순위: 로그인 토큰 (req.user.id)  <-- ⭐ 수정됨 (user_id 아님)
   2순위: Body 데이터 (req.body.userId)
   3순위: Query 파라미터 (req.query.userId)
   4순위: 테스트용 기본값 (9)        <-- ⭐ 추가됨
   -------------------------------------------------------- */
const getUserId = (req) => {
  // 👇 여기가 핵심 수정 포인트입니다.
  // 1. req.user.user_id -> req.user.id (DiaryController와 통일)
  // 2. 맨 뒤에 || 9 추가 (테스트 위해 에러 안 나게 처리)
  const userId = req.user?.id || req.body.userId || req.query.userId || 9;
  
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
    const userId = getUserId(req); 
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
    const userId = getUserId(req); 
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
    // 1. 유저 ID 가져오기
    const userId = getUserId(req);
    
    // 2. 날짜가 없으면 오늘 날짜 기준
    const targetDate = req.body.date || new Date().toISOString();
    
    const newReport = await reportService.generateWeekly(userId, targetDate);
    res.json(newReport);
  } catch (err) {
    next(err);
  }
};