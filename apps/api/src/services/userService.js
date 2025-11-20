// src/services/userService.js
import prisma from "../lib/prisma.js";

/* ============================================================
   1) 회원가입 (bcrypt 제거 → 평문 저장, MVP용)
============================================================ */
export async function register({ email, password, nickname }) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error("이미 가입된 이메일입니다.");

  // 평문 저장 (MVP)
  return prisma.user.create({
    data: {
      email,
      password_hash: password,
      nickname,
      cluster_id: 1, // 기본 클러스터
    },
  });
}

/* ============================================================
   2) 로그인 (bcrypt 제거 → 평문 비교)
============================================================ */
export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("이메일 또는 비밀번호가 잘못되었습니다.");

  if (password !== user.password_hash) {
    throw new Error("이메일 또는 비밀번호가 잘못되었습니다.");
  }

  return user;
}

/* ============================================================
   3) 유저 상세 조회 (전체 정보)
============================================================ */
export async function getById(user_id) {
  return prisma.user.findUnique({
    where: { user_id: Number(user_id) },
    include: {
      diaries: true,
      objects: true,
      bgms: true,
      notifications: true,
      reports: true,
    },
  });
}

/* ============================================================
   4) 유저 설정 업데이트
============================================================ */
export async function updateSettings(user_id, settings) {
  return prisma.user.update({
    where: { user_id: Number(user_id) },
    data: settings,
  });
}

/* ============================================================
   5) 프로필 조회
============================================================ */
export async function getProfile(user_id) {
  return prisma.user.findUnique({
    where: { user_id: Number(user_id) },
    select: {
      user_id: true,
      email: true,
      nickname: true,
      profile_image: true,
    },
  });
}

/* ============================================================
   6) 프로필 수정
============================================================ */
export async function updateProfile(user_id, { nickname, profile_image }) {
  return prisma.user.update({
    where: { user_id: Number(user_id) },
    data: {
      ...(nickname && { nickname }),
      ...(profile_image && { profile_image }),
    },
  });
}

/* ============================================================
   7) 계정 삭제
============================================================ */
export async function deleteAccount(user_id) {
  return prisma.user.delete({
    where: { user_id: Number(user_id) },
  });
}

/* ============================================================
   8) 클러스터 자동 동기화 (임시 로직)
============================================================ */
export async function syncCluster(user_id) {
  const FIXED_NEW_CLUSTER = 2; // 임시 값

  return prisma.user.update({
    where: { user_id: Number(user_id) },
    data: { cluster_id: FIXED_NEW_CLUSTER },
  });
}

/* ============================================================
   9) 알림 조회
============================================================ */
export async function getNotificationSettings(user_id) {
  return prisma.notification.findMany({
    where: { user_id: Number(user_id) },
  });
}

/* ============================================================
   10) 알림 설정 수정
============================================================ */
export async function updateNotificationSettings(user_id, settings) {
  return prisma.notification.updateMany({
    where: { user_id: Number(user_id) },
    data: settings,
  });
}

/* ============================================================
   11) 보고서 조회 (created_date 기준)
============================================================ */
export async function getReport(user_id) {
  return prisma.report.findMany({
    where: { user_id: Number(user_id) },
    orderBy: { created_date: "desc" }, // ← created_at → created_date로 수정
  });
}
