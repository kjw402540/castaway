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

/**
 * 카카오에서 내려주는 유저 정보(kakaoUser)를
 * 우리 DB user테이블과 매핑해서
 *  - kakao_id 기준으로 찾고
 *  - 없으면 새로 만들어서
 * 결국 user 레코드를 리턴
 */
export async function findOrCreateKakaoUser(kakaoUser) {
  // 카카오 유저 고유 id (숫자라서 string으로 고정 저장하는게 편함)
  const kakaoId = String(kakaoUser.id);

  const nickname =
    kakaoUser.properties?.nickname ||
    kakaoUser.kakao_account?.profile?.nickname ||
    "카카오유저";

  const email = kakaoUser.kakao_account?.email || null;

  // 1) kakao_id로 먼저 찾기
  let user = await prisma.user.findUnique({
    where: { kakao_id: kakaoId },
  });

  // 2) 없으면 새로 생성
  if (!user) {
    user = await prisma.user.create({
      data: {
        kakao_id: kakaoId,
        nickname,
        email,
        // password_hash는 카카오 로그인만 쓸 거면 null 또는 빈 문자열로 둬도 됨
        // 나머지 컬럼(created_date, used_flag 등)은 default 값 사용
      },
    });
  }

  return user;
}
