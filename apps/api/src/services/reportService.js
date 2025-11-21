// src/services/reportService.js
import prisma from "../lib/prisma.js";


/* --------------------------------------------------------
   이번 주 리포트 조회
   - 가장 최근 생성된 Report 하나 반환
-------------------------------------------------------- */
export const getWeekly = async (userId) => {
  return prisma.report.findFirst({
    where: { user_id: userId },
    orderBy: { created_date: "desc" },
    include: {
      emotionResult: true,
    },
  });
};


/* --------------------------------------------------------
   전체 리포트 히스토리 조회
   - 날짜 역순 정렬
-------------------------------------------------------- */
export const getHistory = async (userId) => {
  return prisma.report.findMany({
    where: { user_id: userId },
    orderBy: { created_date: "desc" },
  });
};


/* --------------------------------------------------------
   단일 리포트 상세 조회
-------------------------------------------------------- */
export const getById = async (id) => {
  return prisma.report.findUnique({
    where: { report_id: id },
    include: {
      emotionResult: true,
    },
  });
};


/* --------------------------------------------------------
   리포트 생성 (AI 분석 결과 저장)
-------------------------------------------------------- */
export const save = async (data) => {
  return prisma.report.create({
    data,
  });
};
