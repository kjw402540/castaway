// src/controllers/reportController.js
import * as reportService from "../services/reportService.js";

const USER_ID = 1;


/* --------------------------------------------------------
   이번 주 리포트 조회
-------------------------------------------------------- */
export const getWeekly = async (req, res, next) => {
  try {
    const report = await reportService.getWeekly(USER_ID);
    res.json(report);
  } catch (err) {
    next(err);
  }
};


/* --------------------------------------------------------
   전체 히스토리 조회
-------------------------------------------------------- */
export const getHistory = async (req, res, next) => {
  try {
    const list = await reportService.getHistory(USER_ID);
    res.json(list);
  } catch (err) {
    next(err);
  }
};


/* --------------------------------------------------------
   단일 리포트 상세 조회
-------------------------------------------------------- */
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await reportService.getById(Number(id));
    res.json(report);
  } catch (err) {
    next(err);
  }
};


/* --------------------------------------------------------
   리포트 생성 (AI 분석 결과 저장)
-------------------------------------------------------- */
export const save = async (req, res, next) => {
  try {
    const saved = await reportService.save({
      ...req.body,
      user_id: USER_ID,
    });

    res.json(saved);
  } catch (err) {
    next(err);
  }
};
