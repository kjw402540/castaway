import prisma from "../lib/prisma.js";

export const create = (data) => {
  return prisma.notification.create({
    data: {
      user_id: data.user_id,
      message: JSON.stringify({
        title: data.title,
        content: data.content,
        date: new Date(),
      }),
      type: 1, // MailInbox 타입
    },
  });
};

export const getAll = (user_id) => {
  return prisma.notification.findMany({
    where: { user_id, type: 1 },
    orderBy: { notify_time: "desc" }
  });
};

export const remove = (id) => {
  return prisma.notification.delete({
    where: { notify_id: id }
  });
};

export const markAsRead = (id) => {
  return prisma.notification.update({
    where: { notify_id: id },
    data: { used_flag: 1 }
  });
};
