// src/services/userService.js
import prisma from "../lib/prisma.js";

/* ----------------------------------------
   내 정보 조회
----------------------------------------- */
export const get = (userId) => {
  return prisma.user.findUnique({
    where: { user_id: Number(userId) },
  });
};

/* ----------------------------------------
   프로필 수정
----------------------------------------- */
export const update = (userId, data) => {
  const safeData = sanitizeUserUpdate(data);

  return prisma.user.update({
    where: { user_id: Number(userId) },
    data: safeData,
  });
};

/* ----------------------------------------
   회원 탈퇴 (soft delete)
----------------------------------------- */
export const remove = (userId) => {
  return prisma.user.update({
    where: { user_id: Number(userId) },
    data: { used_flag: 0 },
  });
};

/* ----------------------------------------
   수정 데이터 필터링
----------------------------------------- */
function sanitizeUserUpdate(data) {
  const safe = {};

  if (typeof data.nickname === "string") {
    const trimmed = data.nickname.trim();
    if (trimmed.length > 0) safe.nickname = trimmed;
  }

  if (typeof data.diary_reminder === "string") {
    // ex) "21:30" → 그대로 저장, DB가 time 타입으로 자동 처리
    safe.diary_reminder = data.diary_reminder;
  }

  if (typeof data.bgm_volume === "number")
    safe.bgm_volume = clamp(data.bgm_volume, 0, 1);

  if (typeof data.sfx_volume === "number")
    safe.sfx_volume = clamp(data.sfx_volume, 0, 1);

  if (typeof data.cluster_id === "number")
    safe.cluster_id = data.cluster_id;

  return safe;
}

/* ----------------------------------------
   숫자 범위 제한
----------------------------------------- */
function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}
