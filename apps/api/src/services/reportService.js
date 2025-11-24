// src/services/reportService.js
import prisma from "../lib/prisma.js";

/* --------------------------------------------------------
   이번 주 리포트 조회 (가장 최근 Report 1개)
-------------------------------------------------------- */
export const getWeekly = async (userId) => {
  return prisma.report.findFirst({
    where: { user_id: Number(userId) },
    orderBy: { created_date: "desc" },
    include: {
      emotion: true,  // ✔ Report relation은 emotion이 맞음
    },
  });
};

/* --------------------------------------------------------
   전체 리포트 히스토리
-------------------------------------------------------- */
export const getHistory = async (userId) => {
  return prisma.report.findMany({
    where: { user_id: Number(userId) },
    orderBy: { created_date: "desc" },
  });
};

/* --------------------------------------------------------
   단일 리포트 상세 조회
-------------------------------------------------------- */
export const getById = async (id) => {
  return prisma.report.findUnique({
    where: { report_id: Number(id) },
    include: {
      emotion: true,  // ✔ emotion relation OK
    },
  });
};

/* --------------------------------------------------------
   리포트 생성
-------------------------------------------------------- */
export const save = async (data) => {
  // 안전하게 매핑
  return prisma.report.create({
    data: {
      user_id: Number(data.user_id),
      emotion_id: Number(data.emotion_id),
      start_date: data.start_date,
      end_date: data.end_date,
      summary_text: data.summary_text ?? null,
      encouragement_text: data.encouragement_text ?? null,
      emotion_distribution: data.emotion_distribution ?? null,
    },
  });
};
