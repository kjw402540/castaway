// src/services/reportService.js
import prisma from "../lib/prisma.js";

/*
=====================================================
  1) 특정 유저의 전체 리포트 조회
=====================================================
*/
export async function getReportsByUser(user_id) {
  return prisma.report.findMany({
    where: { user_id: Number(user_id) },
    orderBy: { created_date: "desc" },
    include: {
      emotionResult: true,
    },
  });
}

/*
=====================================================
  2) 특정 기간(start_date ~ end_date)의 리포트 조회
=====================================================
*/
export async function getReportByPeriod(user_id, start_date, end_date) {
  return prisma.report.findFirst({
    where: {
      user_id: Number(user_id),
      start_date: new Date(start_date),
      end_date: new Date(end_date),
    },
    include: {
      emotionResult: true,
    },
  });
}

/*
=====================================================
  3) 리포트 생성
     (EmotionResult 하나를 기반으로 보고서 작성)
=====================================================
*/
export async function createReport({
  user_id,
  emotion_id,
  start_date,
  end_date,
  summary_text,
  encouragement_text,
  emotion_distribution,
}) {
  return prisma.report.create({
    data: {
      user_id,
      emotion_id,                 // EmotionResult와 연결됨
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      summary_text,
      encouragement_text,
      emotion_distribution,
    },
    include: {
      emotionResult: true,
    },
  });
}

/*
=====================================================
  4) 리포트 삭제
=====================================================
*/
export async function deleteReport(report_id) {
  return prisma.report.delete({
    where: { report_id: Number(report_id) },
  });
}
