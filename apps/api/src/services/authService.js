// src/services/authService.js
import prisma from "../lib/prisma.js";

/* 회원가입 */
export const signup = async ({ email, nickname, password }) => {
  if (!email || !nickname || !password) {
    throw new Error("email, nickname, password는 필수입니다.");
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error("이미 사용 중인 이메일입니다.");

  return prisma.user.create({
    data: {
      email,
      nickname,
      password_hash: password, // MVP: 평문 저장
      cluster_id: Number(1),   // ★ 핵심 수정
    },
  });
};

/* 로그인 */
export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("email, password는 필수입니다.");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("존재하지 않는 이메일입니다.");

  if (user.password_hash !== password) {
    throw new Error("비밀번호가 틀렸습니다.");
  }

  return user;
};
