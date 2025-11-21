import prisma from "../lib/prisma.js";

export const getAll = () => {
  return prisma.clusterGroup.findMany({
    orderBy: { cluster_id: "asc" },
  });
};

export const getById = (id) => {
  return prisma.clusterGroup.findUnique({
    where: { cluster_id: id },
  });
};
