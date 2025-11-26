// src/services/clusterService.js
import prisma from "../lib/prisma.js";

/* --------------------------------------------------------
   모든 클러스터 조회
-------------------------------------------------------- */
export const getAll = () => {
  return prisma.clusterGroup.findMany({
    orderBy: { cluster_id: "asc" },
  });
};

/* --------------------------------------------------------
   특정 클러스터 조회
-------------------------------------------------------- */
export const getById = (id) => {
  const clusterId = Number(id);

  return prisma.clusterGroup.findUnique({
    where: { cluster_id: clusterId },
  });
};
