// src/services/authService.js
import prisma from "../lib/prisma.js";

/* ----------------------------------------
   내부 유틸: 입력 정리
   - MVP에선 평문 유지
   - 나중에 여기만 bcrypt로 바꾸면 signup/login이 그대로 살아남음
----------------------------------------- */
function normalizeString(v) {
  return (v ?? "").toString().trim();
}

// MVP: 평문 저장/비교
async function hashPassword(plain) {
  return plain; 
}

async function verifyPassword(plain, hashed) {
  return plain === hashed;
}

/* ----------------------------------------
   회원가입
----------------------------------------- */
export const signup = async ({ email, nickname, password }) => {
  email = normalizeString(email);
  nickname = normalizeString(nickname);
  password = normalizeString(password);

  if (!email || !nickname || !password) {
    throw new Error("email, nickname, password는 필수입니다.");
  }

  // 이메일 중복 체크
  const exists = await prisma.user.findUnique({
    where: { email },
  });
  if (exists) throw new Error("이미 사용 중인 이메일입니다.");

  // cluster_id는 Nullable이지만
  // MVP에서는 기본 cluster_id = 1로 넣어도 됨
  const password_hash = await hashPassword(password);

  return prisma.user.create({
    data: {
      email,
      nickname,
      password_hash,
      // 나머지 필드는 Prisma default 사용
    },
  });
};

/* ----------------------------------------
   로그인
----------------------------------------- */
export const login = async ({ email, password }) => {
  email = normalizeString(email);
  password = normalizeString(password);

  if (!email || !password) {
    throw new Error("email, password는 필수입니다.");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("존재하지 않는 이메일입니다.");
  if (user.used_flag === 0) throw new Error("탈퇴한 계정입니다.");

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) throw new Error("비밀번호가 틀렸습니다.");

  return user;
};
