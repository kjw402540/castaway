// src/services/userService.js
import prisma from "../lib/prisma.js";

/* ----------------------------------------
   내 정보 조회
----------------------------------------- */
export const get = (userId) => {
  return prisma.user.findUnique({
    where: { user_id: userId },
  });
};

/* ----------------------------------------
   프로필 수정
----------------------------------------- */
export const update = (userId, data) => {
  return prisma.user.update({
    where: { user_id: userId },
    data,
  });
};

/* ----------------------------------------
   회원 탈퇴
   Diary/Object/BGM 등 FK는 onDelete 설정에 따라 자동 처리됨
----------------------------------------- */
export const remove = (userId) => {
  return prisma.user.delete({
    where: { user_id: userId },
  });
};
