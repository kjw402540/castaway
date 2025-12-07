// src/services/clusterService.js
import prisma from "../lib/prisma.js";
import axios from 'axios';
import { Prisma } from '@prisma/client'; // Raw Query 사용을 위해 추가

const AI_SERVER_BASE_URL  = process.env.AI_BASE_URL || "http://127.0.0.1:8000";

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

/* --------------------------------------------------------
   사용자 클러스터 업데이트
-------------------------------------------------------- */
export const updateUserCluster = async (user_id) => {
  try {
    // 1. 해당 유저의 최근 7개 EmotionResult에서 day_vector 조회
    // ⚠️ Prisma findMany는 Unsupported("vector")를 조회하지 못하므로 queryRaw 사용
    const emotionRecords = await prisma.$queryRaw`
      SELECT day_vector::text 
      FROM "EmotionResult"
      WHERE diary_id IN (
        SELECT diary_id FROM "Diary" WHERE user_id = ${user_id}
      )
      AND day_vector IS NOT NULL
      ORDER BY emotion_id DESC
      LIMIT 7
    `;
    
    if (!emotionRecords || emotionRecords.length === 0) {
      // 💡 에러 대신 메시지 리턴으로 처리하여 서버가 죽지 않도록 함
      console.warn(`⚠️ [Cluster Update] No emotion records found for user ${user_id}`);
      return { message: "No records found" };
    }
    
    // DB에서 ::text로 가져온 벡터('[0.1, ...]')를 파싱하여 배열로 변환
    const day_vectors = emotionRecords.map(r => JSON.parse(r.day_vector));
    
    console.log(`✅ [Cluster Update] user_id=${user_id}, ${day_vectors.length}일치 데이터 전송`);
    
    // 2. AI 서버에 day_vectors 전달하여 클러스터 배정 요청
    // (네트워크 연결이 되어야 이 부분이 성공합니다)
    const response = await axios.post(
      `${AI_SERVER_BASE_URL}/cluster/update`,
      { 
        user_id, 
        day_vectors 
      }
    );
    
    const cluster_id = response.data.cluster_id;
    
    // 3. User 테이블의 cluster_id 업데이트 (UserProfile 아님)
    // schema.prisma에 UserProfile 모델이 없으므로 User 모델을 사용해야 합니다.
    await prisma.user.update({
      where: { user_id: user_id },
      data: { 
        cluster_id: cluster_id
      }
    });
    
    console.log(`✅ [Cluster Saved] user_id=${user_id} → cluster_id=${cluster_id}`);
    
    return {
      user_id,
      cluster_id,
      days_analyzed: day_vectors.length,
      message: "Cluster updated successfully"
    };
    
  } catch (error) {
    // Axios 에러 상세 출력
    if (error.code === 'ETIMEDOUT') {
      console.error(`❌ [Network Error] AI 서버 접속 불가. 방화벽(보안그룹) IP 허용을 확인하세요.`);
    }
    console.error(`❌ [Cluster Update Error] ${error.message}`);
    throw error;
  }
};

/* --------------------------------------------------------
   사용자의 현재 클러스터 정보 조회
-------------------------------------------------------- */
export const getUserCluster = async (user_id) => {
  try {
    // UserProfile 대신 User 테이블 조회
    const user = await prisma.user.findUnique({
      where: { user_id },
      select: { cluster_id: true }
    });
    
    if (!user) {
      throw new Error(`User not found for user ${user_id}`);
    }
    
    return {
      user_id,
      cluster_id: user.cluster_id
    };
  } catch (error) {
    console.error(`❌ [Get Cluster Error] ${error.message}`);
    throw error;
  }
};